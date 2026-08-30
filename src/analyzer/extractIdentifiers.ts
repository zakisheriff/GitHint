import { toNaturalWords, unique } from '../utils/strings.js';

const IDENTIFIER_PATTERNS = [
  /^\+\s*(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/gm,
  /^\+\s*(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/gm,
  /^\+\s*(?:export\s+)?(?:abstract\s+)?(?:class|interface|type|enum)\s+([A-Za-z_$][\w$]*)/gm,
  /^\+\s*(?:async\s+)?def\s+([A-Za-z_]\w*)/gm,
  /^\+\s*class\s+([A-Za-z_]\w*)/gm,
  /^\+\s*func\s+(?:\([^)]*\)\s*)?([A-Za-z_]\w*)/gm,
  /^\+\s*(?:pub\s+)?(?:async\s+)?fn\s+([A-Za-z_]\w*)/gm,
  /^\+\s*(?:pub\s+)?struct\s+([A-Za-z_]\w*)/gm,
  /^\+\s*(?:public|private|protected)?\s*(?:static\s+)?(?:\w+[<>, ?[\]]*\s+)+([A-Za-z_]\w*)\s*\(/gm,
];

const VERB_PREFIX = /^(handle|create|add|update|remove|delete|set|get|use|is|has|on)(?=[A-Z_-]|$)/;

export function extractIdentifiers(diff: string): string[] {
  const identifiers: string[] = [];
  for (const pattern of IDENTIFIER_PATTERNS) {
    for (const match of diff.matchAll(pattern)) {
      const identifier = match[1];
      if (!identifier) continue;
      const withoutPrefix = identifier.replace(VERB_PREFIX, '');
      const normalized = toNaturalWords(withoutPrefix || identifier);
      if (normalized.length > 2) identifiers.push(normalized);
    }
  }
  return unique(identifiers).slice(0, 12);
}
