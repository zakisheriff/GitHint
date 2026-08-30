import { describe, expect, it } from 'vitest';

import { parseNumstat, sampleDiff } from '../../src/git/diff.js';
import { prefersScopes } from '../../src/git/history.js';
import { parseNameStatus } from '../../src/git/status.js';

describe('Git output parsers', () => {
  it('parses added, deleted, and renamed files safely', () => {
    const files = parseNameStatus(
      'A\0src/new file.ts\0D\0old.ts\0R100\0src/old-name.ts\0src/renamed-文件.ts\0',
    );
    expect(files).toMatchObject([
      { path: 'src/new file.ts', status: 'added' },
      { path: 'old.ts', status: 'deleted' },
      { path: 'src/renamed-文件.ts', previousPath: 'src/old-name.ts', status: 'renamed' },
    ]);
  });

  it('parses text and binary numstat output', () => {
    expect(parseNumstat('12\t3\tsrc/app.ts\n-\t-\tlogo.png\n')).toEqual({
      files: 2,
      additions: 12,
      deletions: 3,
    });
  });

  it('samples oversized diffs', () => {
    const result = sampleDiff('abcdef', 3);
    expect(result).toEqual({ diff: 'abc', truncated: true });
  });

  it('detects a repository preference for scoped commits', () => {
    expect(prefersScopes(['feat(auth): login', 'fix(auth): logout', 'test(auth): session'])).toBe(
      true,
    );
    expect(prefersScopes(['add login', 'fix: logout', 'update docs'])).toBe(false);
  });
});
