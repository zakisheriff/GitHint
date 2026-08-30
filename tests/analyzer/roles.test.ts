import { describe, expect, it } from 'vitest';

import { analyzeChanges } from '../../src/analyzer/analyzeChanges.js';
import { intentFiles, roleForFile } from '../../src/analyzer/fileRoles.js';
import { splitDiff } from '../../src/analyzer/splitDiff.js';
import type { RepositorySnapshot } from '../../src/types/index.js';
import { createChangedFile } from '../../src/utils/paths.js';

function fileDiff(path: string, lines: string[]): string {
  return [`diff --git a/${path} b/${path}`, `--- a/${path}`, `+++ b/${path}`, ...lines].join('\n');
}

function snapshot(
  files: Array<[string, 'added' | 'modified' | 'deleted' | 'renamed']>,
  diff: string,
  extra: Partial<RepositorySnapshot> = {},
): RepositorySnapshot {
  return {
    files: files.map(([path, status]) => createChangedFile(path, status)),
    diff,
    branch: 'main',
    recentCommits: [],
    stats: { files: files.length, additions: 4, deletions: 2 },
    truncated: false,
    ...extra,
  };
}

describe('roleForFile', () => {
  it.each([
    ['pnpm-lock.yaml', 'generated'],
    ['dist/index.js', 'generated'],
    ['src/auth/session.ts', 'source'],
    ['src/auth/session.test.ts', 'test'],
    ['docs/guide.md', 'docs'],
    ['src/theme.css', 'style'],
    ['.github/workflows/ci.yml', 'ci'],
    ['Dockerfile', 'build'],
    ['package.json', 'meta'],
  ])('classifies %s as %s', (path, expected) => {
    expect(roleForFile(createChangedFile(path, 'modified'))).toBe(expected);
  });
});

describe('intentFiles', () => {
  it('lets source outrank the lockfile and test that shipped with it', () => {
    const files = [
      createChangedFile('src/auth/session.ts', 'modified'),
      createChangedFile('src/auth/session.test.ts', 'modified'),
      createChangedFile('pnpm-lock.yaml', 'modified'),
    ];
    expect(intentFiles(files).map((entry) => entry.file.path)).toEqual(['src/auth/session.ts']);
  });

  it('falls back to the lower tier when no source changed', () => {
    const files = [
      createChangedFile('README.md', 'modified'),
      createChangedFile('package.json', 'modified'),
    ];
    expect(intentFiles(files).map((entry) => entry.file.path)).toEqual(['README.md']);
  });
});

describe('splitDiff', () => {
  it('separates files and counts their changed lines', () => {
    const diff = [fileDiff('a.ts', ['+one', '+two', '-old']), fileDiff('b.ts', ['+only'])].join(
      '\n',
    );
    const sections = splitDiff(diff);
    expect(sections.map((section) => section.path)).toEqual(['a.ts', 'b.ts']);
    expect(sections[0]).toMatchObject({ additions: 2, deletions: 1 });
  });
});

describe('analyzeChanges with mixed roles', () => {
  it('reads intent from source, not the companion test', () => {
    const diff = [
      fileDiff('src/auth/session.ts', ['+  if (!token) return null;']),
      fileDiff('src/auth/session.test.ts', [
        '+expect(session).toBeNull()',
        '+it("guards", () => {})',
      ]),
    ].join('\n');
    const analysis = analyzeChanges(
      snapshot(
        [
          ['src/auth/session.ts', 'modified'],
          ['src/auth/session.test.ts', 'modified'],
        ],
        diff,
      ),
    );
    expect(analysis.primaryCategory).toBe('fix');
  });

  it('is not turned into a chore by a lockfile bump', () => {
    const diff = [
      fileDiff('src/menu.tsx', ['+export function MobileMenu() { return null }']),
      fileDiff('pnpm-lock.yaml', ['+  resolution: {integrity: sha512-abc}']),
    ].join('\n');
    const analysis = analyzeChanges(
      snapshot(
        [
          ['src/menu.tsx', 'added'],
          ['pnpm-lock.yaml', 'modified'],
        ],
        diff,
      ),
    );
    expect(analysis.primaryCategory).toBe('feat');
  });

  it('does not read prose in a readme as feature work', () => {
    const diff = fileDiff('README.md', [
      '+GitHint can add a commit message and supports every conventional type.',
      '+It implements a new option for scopes.',
    ]);
    const analysis = analyzeChanges(snapshot([['README.md', 'modified']], diff));
    expect(analysis.primaryCategory).toBe('docs');
  });

  it('treats an action version bump as a dependency chore, not CI work', () => {
    const diff = fileDiff('.github/workflows/ci.yml', [
      '-      uses: actions/checkout@v6',
      '+      uses: actions/checkout@v7',
    ]);
    const analysis = analyzeChanges(snapshot([['.github/workflows/ci.yml', 'modified']], diff));
    expect(analysis.primaryCategory).toBe('chore');
  });

  it('files a dependency bump under the type this repository actually uses', () => {
    const diff = fileDiff('package.json', ['-    "vite": "5.0.0"', '+    "vite": "5.1.0"']);
    const history = Array.from({ length: 8 }, (_, i) => `build: update dependency pkg-${i} to v2`);
    const analysis = analyzeChanges(
      snapshot([['package.json', 'modified']], diff, { recentCommits: history }),
    );
    expect(analysis.primaryCategory).toBe('build');
  });
});
