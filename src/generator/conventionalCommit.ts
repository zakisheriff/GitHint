import type { CommitType } from '../types/index.js';
import { sanitizeSubject, truncateSubject } from '../utils/strings.js';

export function formatConventionalCommit(
  type: CommitType,
  description: string,
  scope?: string,
  maxLength = 72,
): string {
  const prefix = scope ? `${type}(${scope}): ` : `${type}: `;
  const subject = truncateSubject(sanitizeSubject(description), maxLength - prefix.length);
  return `${prefix}${subject}`;
}
