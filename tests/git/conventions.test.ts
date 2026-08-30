import { describe, expect, it } from 'vitest';

import { learnConventions, prefersScopes } from '../../src/git/history.js';

describe('learnConventions', () => {
  it('learns the type a repository files dependency bumps under', () => {
    const commits = [
      'build: update dependency typescript to v5',
      'build: update all non-major dependencies',
      'build: bump vite to v6',
      'feat: add a router',
      'fix: correct a guard',
    ];
    expect(learnConventions(commits).dependencyType).toBe('build');
  });

  it('ignores a convention that no clear majority supports', () => {
    const commits = [
      'chore: update dependency a to v2',
      'fix: update dependency b to v3',
      'build: update dependency c to v4',
      'feat: add something',
    ];
    expect(learnConventions(commits).dependencyType).toBeUndefined();
  });

  it('reports the types a repository actually uses', () => {
    const commits = ['feat: a', 'fix: b', 'docs: c', 'not a conventional subject'];
    const conventions = learnConventions(commits);
    expect([...conventions.usedTypes].sort()).toEqual(['docs', 'feat', 'fix']);
    expect(conventions.conventionalRatio).toBeCloseTo(0.75);
  });
});

describe('prefersScopes', () => {
  it('detects a scoped convention', () => {
    expect(prefersScopes(['feat(api): a', 'fix(api): b', 'docs(readme): c'])).toBe(true);
  });

  it('ignores unscoped histories', () => {
    expect(prefersScopes(['feat: a', 'fix: b', 'docs: c'])).toBe(false);
  });
});
