const ACRONYM_BOUNDARY = /([A-Z]+)([A-Z][a-z])/g;
const WORD_BOUNDARY = /([a-z\d])([A-Z])/g;

export function toNaturalWords(value: string): string {
  return value
    .replace(/\.[^.]+$/, '')
    .replace(ACRONYM_BOUNDARY, '$1 $2')
    .replace(WORD_BOUNDARY, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

export function truncateSubject(subject: string, availableLength: number): string {
  if (subject.length <= availableLength) return subject;
  const shortened = subject.slice(0, Math.max(0, availableLength - 1));
  const boundary = shortened.lastIndexOf(' ');
  return `${shortened.slice(0, boundary > 8 ? boundary : undefined).trim()}…`;
}

export function sanitizeSubject(subject: string): string {
  return subject
    .replace(/^[A-Z]/, (character) => character.toLowerCase())
    .replace(/[.!?]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}
