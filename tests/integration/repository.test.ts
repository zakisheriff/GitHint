import { execFileSync } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { GitRepository } from '../../src/git/repository.js';

const temporaryDirectories: string[] = [];

function git(cwd: string, args: string[]): string {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
}

async function createRepository(): Promise<string> {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'githint-test-'));
  temporaryDirectories.push(directory);
  git(directory, ['init', '-q']);
  git(directory, ['config', 'user.email', 'githint@example.test']);
  git(directory, ['config', 'user.name', 'GitHint Tests']);
  await writeFile(path.join(directory, 'app.ts'), 'export const value = 1;\n');
  git(directory, ['add', 'app.ts']);
  git(directory, ['commit', '-qm', 'chore: add baseline']);
  return directory;
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map(async (directory) => rm(directory, { recursive: true, force: true })),
  );
});

describe('GitRepository integration', () => {
  it('reads only staged changes and commits safely', async () => {
    const directory = await createRepository();
    await writeFile(
      path.join(directory, 'app.ts'),
      'export const value = 2;\nexport function validateValue() { return value > 0; }\n',
    );
    await writeFile(path.join(directory, 'unstaged.ts'), 'do not analyze\n');
    git(directory, ['add', 'app.ts']);

    const repository = new GitRepository(directory);
    expect(await repository.isRepository()).toBe(true);
    expect(await repository.hasStagedChanges()).toBe(true);
    const snapshot = await repository.snapshot();
    expect(snapshot.files.map((file) => file.path)).toEqual(['app.ts']);
    expect(snapshot.diff).toContain('validateValue');
    expect(snapshot.diff).not.toContain('do not analyze');

    const result = await repository.commit('feat: add value validation');
    expect(result.ok).toBe(true);
    expect(git(directory, ['log', '-1', '--pretty=%s'])).toBe('feat: add value validation');
  });

  it('handles initial repositories without commit history', async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), 'githint-empty-'));
    temporaryDirectories.push(directory);
    git(directory, ['init', '-q']);
    await writeFile(path.join(directory, 'README.md'), '# Project\n');
    git(directory, ['add', 'README.md']);

    const repository = new GitRepository(directory);
    const snapshot = await repository.snapshot();
    expect(snapshot.recentCommits).toEqual([]);
    expect(snapshot.files).toHaveLength(1);
  });
});
