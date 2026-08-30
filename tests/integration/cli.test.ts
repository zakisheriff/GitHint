import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

const projectRoot = path.resolve(import.meta.dirname, '../..');
const tsx = path.join(projectRoot, 'node_modules', '.bin', 'tsx');
const entry = path.join(projectRoot, 'src', 'index.ts');
const temporaryDirectories: string[] = [];

function git(cwd: string, args: string[]): string {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
}

async function createRepository(): Promise<string> {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'githint-cli-'));
  temporaryDirectories.push(directory);
  git(directory, ['init', '-q']);
  git(directory, ['config', 'user.email', 'githint@example.test']);
  git(directory, ['config', 'user.name', 'GitHint Tests']);
  return directory;
}

function runCli(cwd: string, args: string[]) {
  return spawnSync(tsx, [entry, ...args], {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, NO_COLOR: '1', XDG_CONFIG_HOME: path.join(cwd, '.test-config') },
  });
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map(async (directory) => rm(directory, { recursive: true, force: true })),
  );
});

describe('GitHint CLI integration', () => {
  it('prints only a useful message in plain mode', async () => {
    const directory = await createRepository();
    await writeFile(path.join(directory, 'README.md'), '# GitHint Example\n');
    git(directory, ['add', 'README.md']);

    const result = runCli(directory, ['suggest', '--plain']);
    expect(result.status).toBe(0);
    expect(result.stdout).toBe('docs: update readme documentation\n');
  });

  it('commits immediately with --yes', async () => {
    const directory = await createRepository();
    await writeFile(
      path.join(directory, 'MobileMenu.tsx'),
      'export function MobileMenu() { return <nav />; }\n',
    );
    git(directory, ['add', 'MobileMenu.tsx']);

    const result = runCli(directory, ['--yes']);
    expect(result.status).toBe(0);
    expect(git(directory, ['log', '-1', '--pretty=%s'])).toBe('feat: add mobile menu');
  });

  it('explains when nothing is staged', async () => {
    const directory = await createRepository();
    const result = runCli(directory, ['suggest', '--plain']);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('No staged changes found');
    expect(result.stderr).toContain('git add .');
  });

  it('explains when the directory is not a repository', async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), 'githint-not-git-'));
    temporaryDirectories.push(directory);
    const result = runCli(directory, ['suggest', '--plain']);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('This directory is not a Git repository');
  });
});
