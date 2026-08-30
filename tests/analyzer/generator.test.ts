import { describe, expect, it } from 'vitest';

import { analyzeChanges } from '../../src/analyzer/analyzeChanges.js';
import { generateCandidates } from '../../src/generator/commitGenerator.js';
import { formatConventionalCommit } from '../../src/generator/conventionalCommit.js';
import type { RepositorySnapshot } from '../../src/types/index.js';
import { createChangedFile } from '../../src/utils/paths.js';

function analyze(paths: string[], diff: string) {
  const snapshot: RepositorySnapshot = {
    files: paths.map((path) => createChangedFile(path, 'added')),
    diff,
    branch: 'main',
    recentCommits: [],
    stats: { files: paths.length, additions: 10, deletions: 0 },
    truncated: false,
  };
  return analyzeChanges(snapshot);
}

describe('generateCandidates', () => {
  it('generates a specific feature candidate', () => {
    const analysis = analyze(
      ['src/components/MobileMenu.tsx'],
      '+export function MobileMenu() { return <nav /> }',
    );
    expect(generateCandidates(analysis)[0]?.message).toBe('feat: add mobile menu');
  });

  it('adds a meaningful inferred scope', () => {
    const analysis = analyze(
      ['src/auth/login.ts', 'src/auth/session.ts'],
      '+export function refreshSession() {}',
    );
    expect(generateCandidates(analysis, { includeScope: true })[0]?.message).toMatch(
      /^feat\(auth\): /,
    );
  });

  it('respects a forced type', () => {
    const analysis = analyze(['src/cache.ts'], '+export function cacheResult() {}');
    expect(generateCandidates(analysis, { type: 'perf' })[0]?.message).toMatch(/^perf: /);
  });

  it('keeps messages within the configured length', () => {
    const message = formatConventionalCommit(
      'feat',
      'add an extremely detailed and unnecessarily long authentication experience',
      'authentication',
      50,
    );
    expect(message.length).toBeLessThanOrEqual(50);
  });
});
