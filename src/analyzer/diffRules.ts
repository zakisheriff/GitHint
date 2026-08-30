import type { CommitType } from '../types/index.js';

const RULES: Array<[CommitType, RegExp, number]> = [
  [
    'fix',
    /\b(fix|bug|prevent|fallback|invalid|missing|incorrect|undefined|duplicate|error|exception|retry|guard|validation|sanitize|edge case|crash)\b/i,
    4,
  ],
  ['fix', /^\+.*\b(if\s*\(!|try\s*\{|catch\s*\(|\?\?|\.\?|throw new)\b/im, 3],
  [
    'perf',
    /\b(cache|memo(?:ize)?|lazy|optimi[sz]e|performance|batch|debounce|throttle|allocation)\b/i,
    7,
  ],
  ['refactor', /\b(refactor|extract|rename|reorganize|simplif|deduplicat|move)\w*\b/i, 5],
  ['test', /^\+.*\b(describe|it|test|expect|assert)\s*\(/im, 4],
  [
    'style',
    /^[-+].*(className\s*=|style\s*=|\b(?:padding|margin|gap|rounded|border|text-|bg-|flex|grid|width|height)\b)/im,
    3,
  ],
  ['feat', /^\+.*\b(export\s+)?(async\s+)?(function|class|interface|type)\s+[A-Za-z_$]/im, 4],
  [
    'feat',
    /^\+.*\b(onClick|onSubmit|addEventListener|router\.(get|post|put|delete)|app\.(get|post|put|delete))\b/im,
    5,
  ],
  ['revert', /\brevert(ed|ing)?\b/i, 10],
];

export function scoresForDiff(diff: string): Partial<Record<CommitType, number>> {
  const scores: Partial<Record<CommitType, number>> = {};
  for (const [type, pattern, weight] of RULES) {
    if (pattern.test(diff)) scores[type] = (scores[type] ?? 0) + weight;
  }
  return scores;
}

export function containsFunctionalChanges(diff: string): boolean {
  return /^[-+].*\b(onClick|onSubmit|fetch\(|await |return |throw |if\s*\(|switch\s*\(|=>)\b/im.test(
    diff,
  );
}
