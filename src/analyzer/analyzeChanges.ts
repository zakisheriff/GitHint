import { containsFunctionalChanges, scoresForDiff } from './diffRules.js';
import { determineScope } from './determineScope.js';
import { extractIdentifiers } from './extractIdentifiers.js';
import { fileCategory, scoresForFile } from './fileRules.js';
import type { ChangeAnalysis, CommitType, RepositorySnapshot } from '../types/index.js';
import { COMMIT_TYPES } from '../types/index.js';
import { conceptFromPath } from '../utils/paths.js';
import { unique } from '../utils/strings.js';

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
  for (const file of snapshot.files) mergeScores(scores, scoresForFile(file));
  mergeScores(scores, scoresForDiff(snapshot.diff));

  const categories = unique(snapshot.files.map(fileCategory).filter((value) => value !== 'code'));
  const exclusiveCategory =
    categories.length === 1 && snapshot.files.every((file) => fileCategory(file) === categories[0]);
  if (exclusiveCategory && categories[0]) scores[categories[0]] += 15;

  if (containsFunctionalChanges(snapshot.diff)) scores.style = Math.max(0, scores.style - 6);
  if (/^(fix|bug|hotfix)(\/|-)/i.test(snapshot.branch)) scores.fix += 8;
  if (
    snapshot.files.filter((file) => file.status === 'renamed').length >=
    Math.max(1, snapshot.files.length / 2)
  ) {
    scores.refactor += 12;
  }

  const ranked = [...COMMIT_TYPES].sort((left, right) => scores[right] - scores[left]);
  const primaryCategory = ranked[0] ?? 'chore';
  const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const confidence =
    total > 0 ? Math.min(1, scores[primaryCategory] / Math.max(1, total * 0.55)) : 0;
  const concepts = unique(
    snapshot.files
      .map((file) => conceptFromPath(file.path))
      .filter((value): value is string => Boolean(value)),
  );
  const topLevelGroups = unique(snapshot.files.map((file) => file.path.split('/')[0] ?? file.path));
  const unrelatedChanges =
    categories.length >= 3 || (topLevelGroups.length >= 3 && concepts.length >= 3);

  const likelyScope = determineScope(snapshot.files);
  return {
    files: snapshot.files,
    addedFiles: snapshot.files.filter((file) => file.status === 'added').map((file) => file.path),
    modifiedFiles: snapshot.files
      .filter((file) => file.status === 'modified')
      .map((file) => file.path),
    deletedFiles: snapshot.files
      .filter((file) => file.status === 'deleted')
      .map((file) => file.path),
    categories: categories as CommitType[],
    primaryCategory: unrelatedChanges ? 'chore' : primaryCategory,
    identifiers: extractIdentifiers(snapshot.diff),
    concepts,
    ...(likelyScope ? { likelyScope } : {}),
    scores,
    confidence,
    unrelatedChanges,
    stats: snapshot.stats,
  };
}
