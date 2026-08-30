import type { ChangedFile, CommitType, DiffStats } from '../types/index.js';

const ADDED_LINES = /^\+(?!\+\+)/;

/** Keyword and shape rules scored against the lines a commit adds. */
const RULES: Array<[CommitType, RegExp, number]> = [
  [
    'fix',
    /\b(fix(e[sd])?|bug|regression|crash|broken|incorrect|invalid|missing|wrong|unexpected|fail(s|ed|ure)?|edge case|race condition|memory leak|typo|off by one|workaround|revert)\b/i,
    6,
  ],
  [
    'fix',
    /^\+.*(?:if\s*\(\s*!|===?\s*(?:null|undefined)|\?\?|\?\.|catch\s*\(|throw new |guard\b)/im,
    4,
  ],
  ['fix', /^\+.*\b(sanitize|escape|clamp|fallback|guard against|edge ?case)\b/im, 3],
  [
    'perf',
    /\b(perf(ormance)?|optimi[sz]ed?|memo(?:ize|ise)?d?|cache[ds]?|lazy[- ]load|debounce|throttle|faster|speed ?up|reduce allocations?|hot path)\b/i,
    8,
  ],
  [
    'refactor',
    /\b(refactor(ed|ing)?|extract(ed)?|rename[ds]?|reorganiz|restructur|simplif(y|ied)|deduplicat|dead code|clean ?up|inline[ds]?|move[ds]? .* (?:to|into)|replace[ds]? .* with|use \w+ instead|switch(ed)? to|migrat(e|ed|ing) .* to|in favou?r of|no longer needed)\b/i,
    7,
  ],
  [
    'feat',
    /^\+\s*(?:export\s+)(?:default\s+)?(?:async\s+)?(?:function|class|const|interface|type|enum)\s+[A-Za-z_$]/im,
    6,
  ],
  [
    'feat',
    /^\+.*\b(?:onClick|onSubmit|addEventListener|router\.(?:get|post|put|patch|delete)|app\.(?:get|post|put|patch|delete)|\.command\(|\.option\(|@(?:Get|Post|Put|Delete)\()/im,
    6,
  ],
  [
    'feat',
    /\b(add(ed|s)?|introduce[ds]?|implement(ed|s)?|support(s| for)?|allow(s|ing)? (?:for )?|new (?:option|flag|command|endpoint|component))\b/i,
    5,
  ],
  ['feat', /^\+.*(?:'--[a-z][\w-]+'|"--[a-z][\w-]+"|`--[a-z][\w-]+`)/im, 6],
  [
    'style',
    /^[-+].*(?:className\s*=|style\s*=|\b(?:padding|margin|gap|rounded|border|text-|bg-|flex|grid)\b)/im,
    3,
  ],
  ['revert', /\brevert(ed|ing)?\s+(?:commit|"|')/i, 12],
];

export function scoresForDiff(diff: string): Partial<Record<CommitType, number>> {
  const added = diff
    .split('\n')
    .filter((line) => ADDED_LINES.test(line))
    .join('\n');
  const scores: Partial<Record<CommitType, number>> = {};
  for (const [type, pattern, weight] of RULES) {
    if (pattern.test(pattern.multiline ? diff : added)) {
      scores[type] = (scores[type] ?? 0) + weight;
    }
  }
  return scores;
}

/**
 * Distinguishes feat / fix / refactor from the *shape* of the change rather than
 * its wording: new files and new exports read as features, edits to existing code
 * read as fixes, and churn that neither adds nor removes surface reads as a refactor.
 */
export function scoresForShape(
  files: ChangedFile[],
  diff: string,
  stats: DiffStats,
): Partial<Record<CommitType, number>> {
  const scores: Partial<Record<CommitType, number>> = {};
  const added = files.filter((file) => file.status === 'added').length;
  const deleted = files.filter((file) => file.status === 'deleted').length;
  const renamed = files.filter((file) => file.status === 'renamed').length;
  const bump = (type: CommitType, weight: number) => {
    scores[type] = (scores[type] ?? 0) + weight;
  };

  if (added > 0) bump('feat', Math.min(10, 5 + added * 2));
  if (renamed >= Math.max(1, files.length / 2)) bump('refactor', 12);
  if (deleted > 0 && added === 0) bump('refactor', 4);

  const newExports = (diff.match(/^\+\s*export\s+/gim) ?? []).length;
  const removedExports = (diff.match(/^-\s*export\s+/gim) ?? []).length;
  if (newExports > removedExports) bump('feat', Math.min(8, (newExports - removedExports) * 3));
  if (removedExports > newExports) bump('refactor', 4);

  // A small edit that only touches existing files is far more often a fix than a
  // feature. Removing a file outright is not an edit, so it is excluded.
  const churn = stats.additions + stats.deletions;
  const editOnly = added === 0 && renamed === 0 && deleted === 0;
  if (editOnly && churn > 0 && churn <= 30) bump('fix', 8);
  if (editOnly && churn > 30 && churn <= 120) bump('fix', 3);

  // Balanced churn with no new surface area is the signature of a refactor.
  const balanced =
    stats.deletions > 0 &&
    stats.additions > 0 &&
    Math.abs(stats.additions - stats.deletions) <= Math.max(3, stats.additions * 0.2);
  if (balanced && newExports === 0 && added === 0) bump('refactor', 6);

  return scores;
}

export function containsFunctionalChanges(diff: string): boolean {
  return /^[-+].*\b(onClick|onSubmit|fetch\(|await |return |throw |if\s*\(|switch\s*\(|=>)/im.test(
    diff,
  );
}
