import { describe, expect, it } from 'vitest';

import { analyzeChanges } from '../../src/analyzer/analyzeChanges.js';
import type { FileStatus, RepositorySnapshot } from '../../src/types/index.js';
import { createChangedFile } from '../../src/utils/paths.js';

function snapshot(path: string, diff = '', status: FileStatus = 'modified'): RepositorySnapshot {
  return {
    files: [createChangedFile(path, status)],
    diff,
    branch: 'main',
    recentCommits: [],
    stats: { files: 1, additions: 1, deletions: 0 },
    truncated: false,
  };
}

describe('analyzeChanges', () => {
  it.each([
    ['README.md', '', 'docs'],
    ['src/theme.css', '+.button { margin: 1rem; }', 'style'],
    ['src/cart.test.ts', '+expect(total).toBe(10)', 'test'],
    ['package-lock.json', '+"version": "2.0.0"', 'chore'],
    ['.github/workflows/test.yml', '+jobs:', 'ci'],
    ['src/components/SearchBar.tsx', '+export function SearchBar() { return null }', 'feat'],
  ])('classifies %s as %s', (path, diff, expected) => {
    expect(analyzeChanges(snapshot(path, diff)).primaryCategory).toBe(expected);
  });

  it('classifies rename-heavy changes as refactor', () => {
    expect(analyzeChanges(snapshot('src/auth/session.ts', '', 'renamed')).primaryCategory).toBe(
      'refactor',
    );
  });

  it('uses bug guard patterns as a fix signal', () => {
    const diff = '+if (!user) return null; // prevent invalid session';
    expect(analyzeChanges(snapshot('src/auth/session.ts', diff)).primaryCategory).toBe('fix');
  });
});
