import { containsFunctionalChanges, scoresForDiff, scoresForShape } from './diffRules.js';
import { determineScope } from './determineScope.js';
import { extractIdentifiers } from './extractIdentifiers.js';
import { intentFiles, roleForFile, type FileRole, type RoledFile } from './fileRoles.js';
import { diffForPaths, splitDiff } from './splitDiff.js';
import type {
  ChangeAnalysis,
  ChangedFile,
  CommitType,
  RepositorySnapshot,
} from '../types/index.js';
import { COMMIT_TYPES } from '../types/index.js';
import { learnConventions } from '../git/history.js';
import { conceptFromPath } from '../utils/paths.js';
import { unique } from '../utils/strings.js';

/** Roles that map straight onto a commit type once they own the intent tier. */
const ROLE_TYPE: Record<Exclude<FileRole, 'source'>, CommitType> = {
  test: 'test',
  docs: 'docs',
  style: 'style',
  ci: 'ci',
  build: 'build',
  meta: 'chore',
  generated: 'chore',
};

/** True when a diff only moves version pins around (`uses: x@v6` -> `@v7`). */
function isVersionPinBump(diff: string): boolean {
  const changed = diff
    .split('\n')
    .filter((line) => /^[-+](?!["+-])/.test(line) && line.trim().length > 1);
  if (changed.length === 0) return false;
  const pinLike = changed.filter((line) =>
    /(uses:\s*\S+@|@?v?\d+\.\d+\.\d+|@v\d+\b|version\s*[:=])/i.test(line),
  );
  return pinLike.length / changed.length >= 0.8;
}

/** A commit that only moves manifests and lockfiles is a dependency bump. */
function isDependencyBump(intent: RoledFile[], files: ChangedFile[]): boolean {
  const onlyPackaging = files.every((file) => {
    const role = roleForFile(file);
    return role === 'generated' || role === 'meta';
  });
  return onlyPackaging && intent.length > 0;
}

function emptyScores(): Record<CommitType, number> {
  return Object.fromEntries(COMMIT_TYPES.map((type) => [type, 0])) as Record<CommitType, number>;
}

function mergeScores(
  target: Record<CommitType, number>,
  incoming: Partial<Record<CommitType, number>>,
): void {
  for (const [type, score] of Object.entries(incoming)) {
    target[type as CommitType] += score;
  }
}

export function analyzeChanges(snapshot: RepositorySnapshot): ChangeAnalysis {
  const scores = emptyScores();
  const sections = splitDiff(snapshot.diff);

  // Only the highest-tier files vote: a lockfile bump or a companion test never
  // outranks the source change it shipped with.
  const intent = intentFiles(snapshot.files);
  const intentPaths = new Set(intent.map((entry) => entry.file.path));
  const intentDiff = diffForPaths(sections, intentPaths) || snapshot.diff;
  const intentRoles = unique(intent.map((entry) => entry.role));
  const sourceDriven = intentRoles.includes('source');

  if (sourceDriven) {
    const sourceFiles = intent
      .filter((entry) => entry.role === 'source')
      .map((entry) => entry.file);
    const sourcePaths = new Set(sourceFiles.map((file) => file.path));
    const sourceDiff = diffForPaths(sections, sourcePaths) || intentDiff;
    const sourceStats = sections
      .filter((section) => sourcePaths.has(section.path))
      .reduce(
        (totals, section) => ({
          files: totals.files + 1,
          additions: totals.additions + section.additions,
          deletions: totals.deletions + section.deletions,
        }),
        { files: 0, additions: 0, deletions: 0 },
      );
    mergeScores(scores, scoresForDiff(sourceDiff));
    mergeScores(
      scores,
      scoresForShape(sourceFiles, sourceDiff, sourceStats.files > 0 ? sourceStats : snapshot.stats),
    );
    // Code that changes behaviour is not a styling commit.
    if (containsFunctionalChanges(sourceDiff)) scores.style = Math.max(0, scores.style - 8);
    // Nothing spoke up: an edit to existing code is a fix more often than anything else.
    if (COMMIT_TYPES.every((type) => scores[type] === 0)) scores.fix += 2;
  } else {
    // Score once per distinct role, not per file: a bump touching six package.json
    // files is not six times more of a chore than one touching a single manifest.
    const roleCounts = new Map<CommitType, number>();
    for (const entry of intent) {
      const type = ROLE_TYPE[entry.role as Exclude<FileRole, 'source'>];
      roleCounts.set(type, (roleCounts.get(type) ?? 0) + 1);
    }
    for (const [type, count] of roleCounts) scores[type] += 10 + Math.min(4, count - 1);
    // Deliberately no keyword scoring here: prose is not code. A README that
    // documents a feature is full of words like "add" and "support", and reading
    // them as intent turns every docs edit into a feature.
    if (/^\+.*\brevert(ed|ing)?\s+(?:commit|"|')/im.test(intentDiff)) scores.revert += 12;
    // Bumping `uses: action@v6` is a dependency update that happens to live in a
    // workflow file, not a change to how CI works.
    if (intentRoles.includes('ci') && isVersionPinBump(intentDiff)) {
      scores.ci = Math.max(0, scores.ci - 12);
      scores.chore += 10;
    }
  }

  const conventions = learnConventions(snapshot.recentCommits);
  const dependencyBump = isDependencyBump(intent, snapshot.files);
  // The repo's own log decides what a dependency bump is called here.
  if (dependencyBump && conventions.dependencyType) {
    scores[conventions.dependencyType] += 20;
  }
  // Never suggest a type this project has never once used.
  if (conventions.usedTypes.size >= 4 && conventions.conventionalRatio >= 0.5) {
    for (const type of COMMIT_TYPES) {
      if (!conventions.usedTypes.has(type)) scores[type] = Math.max(0, scores[type] - 6);
    }
  }

  if (/^(fix|bug|hotfix|patch)([/\-_]|$)/i.test(snapshot.branch)) scores.fix += 8;
  if (/^(feat|feature)([/\-_]|$)/i.test(snapshot.branch)) scores.feat += 8;
  if (/^(chore|deps|dependabot)([/\-_]|$)/i.test(snapshot.branch)) scores.chore += 8;

  const ranked = [...COMMIT_TYPES].sort((left, right) => scores[right] - scores[left]);
  const primaryCategory = ranked[0] ?? 'chore';
  const runnerUp = ranked[1];

  // Confidence is the margin over the next best type, not a share of the total:
  // a clear winner should read as confident even when several rules fired.
  const top = scores[primaryCategory];
  const second = runnerUp ? scores[runnerUp] : 0;
  const confidence = top <= 0 ? 0 : Math.min(1, 0.45 + (top - second) / Math.max(top, 8) / 2);

  const categories = unique(
    snapshot.files
      .map((file) => roleForFile(file))
      .filter((role): role is Exclude<FileRole, 'source'> => role !== 'source')
      .map((role) => ROLE_TYPE[role]),
  );
  const concepts = unique(
    intent
      .map((entry) => conceptFromPath(entry.file.path))
      .filter((value): value is string => Boolean(value)),
  );
  const topLevelGroups = unique(snapshot.files.map((file) => file.path.split('/')[0] ?? file.path));
  const unrelatedChanges =
    intent.length >= 4 && topLevelGroups.length >= 3 && concepts.length >= 4 && !sourceDriven;

  const likelyScope = determineScope(intent.map((entry) => entry.file));
  const identifiers = extractIdentifiers(intentDiff, intentPaths, sections);

  const byStatus = (status: ChangedFile['status']) =>
    snapshot.files.filter((file) => file.status === status).map((file) => file.path);

  return {
    files: snapshot.files,
    addedFiles: byStatus('added'),
    modifiedFiles: byStatus('modified'),
    deletedFiles: byStatus('deleted'),
    categories,
    primaryCategory: unrelatedChanges ? 'chore' : primaryCategory,
    identifiers,
    concepts,
    ...(likelyScope ? { likelyScope } : {}),
    scores,
    confidence,
    unrelatedChanges,
    stats: snapshot.stats,
    intentFiles: intent.map((entry) => entry.file),
    sourceDriven,
  };
}
