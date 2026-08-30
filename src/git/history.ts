import { COMMIT_TYPES, type CommitType } from '../types/index.js';

const HISTORY_DEPTH = 300;
const SUBJECT = /^([a-z]+)(?:\(([^)]+)\))?!?:\s+(.*)$/i;
/** Subjects that describe a dependency bump, whatever type the repo files them under. */
const DEPENDENCY_SUBJECT =
  /\b(update|bump|upgrade|pin|downgrade)\b.*\b(dependency|dependencies|deps?|lockfile|lock file|packages?|to v?\d|monorepo)\b|\bdeps\b|\brenovate\b|\bdependabot\b/i;

export function parseHistory(output: string): string[] {
  return output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, HISTORY_DEPTH);
}

export function prefersScopes(commits: string[]): boolean {
  const conventional = commits.filter((commit) => SUBJECT.test(commit));
  if (conventional.length < 3) return false;
  const scoped = conventional.filter((commit) => /^[a-z]+\([^)]+\)!?:\s/i.test(commit)).length;
  return scoped / conventional.length >= 0.6;
}

export interface RepoConventions {
  /** The type this repository actually files dependency bumps under. */
  dependencyType?: CommitType;
  /** Types seen in recent history, used to avoid suggesting one the repo never uses. */
  usedTypes: Set<CommitType>;
  conventionalRatio: number;
}

function isCommitType(value: string): value is CommitType {
  return (COMMIT_TYPES as readonly string[]).includes(value);
}

/**
 * Reads the repository's own history to learn local convention. The same
 * dependency bump is filed as `build` in one project, `chore` in another and
 * `fix` in a third — no amount of diff reading can settle that, but the log can.
 */
export function learnConventions(commits: string[]): RepoConventions {
  const usedTypes = new Set<CommitType>();
  const dependencyCounts = new Map<CommitType, number>();
  let conventional = 0;

  for (const subject of commits) {
    const match = SUBJECT.exec(subject);
    if (!match) continue;
    const [, rawType = '', scope = '', rest = ''] = match;
    const type = rawType.toLowerCase();
    if (!isCommitType(type)) continue;
    conventional += 1;
    usedTypes.add(type);
    if (DEPENDENCY_SUBJECT.test(`${scope} ${rest}`)) {
      dependencyCounts.set(type, (dependencyCounts.get(type) ?? 0) + 1);
    }
  }

  const ranked = [...dependencyCounts.entries()].sort((left, right) => right[1] - left[1]);
  const winner = ranked[0];
  const total = ranked.reduce((sum, [, count]) => sum + count, 0);
  const conventions: RepoConventions = {
    usedTypes,
    conventionalRatio: commits.length > 0 ? conventional / commits.length : 0,
  };
  // Require a real majority before overriding the default, so one stray commit
  // cannot rewrite the convention.
  if (winner && winner[1] >= 3 && winner[1] / total >= 0.6) conventions.dependencyType = winner[0];
  return conventions;
}
