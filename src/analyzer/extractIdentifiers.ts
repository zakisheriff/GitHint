import type { DiffSection } from './splitDiff.js';
import { toNaturalWords, unique } from '../utils/strings.js';

interface Pattern {
  regex: RegExp;
  exported?: boolean;
}

const IDENTIFIER_PATTERNS: Pattern[] = [
  {
    regex: /^\+\s*export\s+(?:default\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/gm,
    exported: true,
  },
  { regex: /^\+\s*export\s+(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*[=:]/gm, exported: true },
  {
    regex: /^\+\s*export\s+(?:abstract\s+)?(?:class|interface|type|enum)\s+([A-Za-z_$][\w$]*)/gm,
    exported: true,
  },
  { regex: /^\+\s*(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/gm },
  {
    regex:
      /^\+\s*(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:\([^)]*\)\s*=>|function)/gm,
  },
  { regex: /^\+\s*(?:abstract\s+)?(?:class|interface|type|enum)\s+([A-Za-z_$][\w$]*)/gm },
  { regex: /^\+\s*(?:async\s+)?def\s+([A-Za-z_]\w*)/gm },
  { regex: /^\+\s*class\s+([A-Za-z_]\w*)/gm },
  { regex: /^\+\s*func\s+(?:\([^)]*\)\s*)?([A-Za-z_]\w*)/gm },
  { regex: /^\+\s*(?:pub\s+)?(?:async\s+)?fn\s+([A-Za-z_]\w*)/gm, exported: true },
  { regex: /^\+\s*(?:pub\s+)?struct\s+([A-Za-z_]\w*)/gm },
];

const VERB_PREFIX = /^(handle|create|add|update|remove|delete|set|get|use|is|has|on)(?=[A-Z_-]|$)/;

/** Internal plumbing that is rarely what a commit is *about*. */
const PLUMBING =
  /^(empty|merge|make|build|to|from|with|wrap|inner|outer|temp|tmp|noop|default|options?|props?|state|result|value|data|item|entry|index|key|args?|params?|ctx|context|config|helper|util|utils|scores?|counts?)$/i;

interface Candidate {
  name: string;
  score: number;
}

function scoreName(name: string, exported: boolean, weight: number, basename: string): number {
  let score = weight + (exported ? 8 : 0);
  const words = name.split(' ');
  if (words.length >= 2) score += 4;
  if (words.every((word) => PLUMBING.test(word))) score -= 12;
  if (name.replaceAll(' ', '') === basename.toLowerCase()) score += 10;
  if (name.length <= 3) score -= 6;
  return score;
}

/**
 * Pulls identifiers out of added lines and ranks them, so the subject reflects the
 * headline symbol of the change rather than whichever helper matched first.
 */
export function extractIdentifiers(
  diff: string,
  paths?: Set<string>,
  sections?: DiffSection[],
): string[] {
  const wholeDiff: DiffSection = { path: '', body: diff, additions: 0, deletions: 0 };
  const selected = sections && paths ? sections.filter((section) => paths.has(section.path)) : [];
  // Fall back to the raw diff when it carries no parsable file headers (e.g. truncated).
  const scoped = selected.length > 0 ? selected : [wholeDiff];

  const candidates = new Map<string, Candidate>();
  for (const section of scoped) {
    // Bigger edits within the commit carry more of its meaning.
    const weight = Math.min(8, 1 + section.additions / 8);
    const basename = (section.path.split('/').pop() ?? '').replace(/\.[^.]+$/, '').toLowerCase();
    for (const { regex, exported } of IDENTIFIER_PATTERNS) {
      for (const match of section.body.matchAll(regex)) {
        const identifier = match[1];
        if (!identifier) continue;
        const withoutPrefix = identifier.replace(VERB_PREFIX, '');
        const normalized = toNaturalWords(withoutPrefix || identifier);
        if (normalized.length <= 2) continue;
        const score = scoreName(normalized, Boolean(exported), weight, basename);
        const existing = candidates.get(normalized);
        if (!existing || score > existing.score)
          candidates.set(normalized, { name: normalized, score });
      }
    }
  }

  return unique(
    [...candidates.values()].sort((left, right) => right.score - left.score).map((c) => c.name),
  ).slice(0, 12);
}
