import type { RepositorySnapshot } from '../types/index.js';
import { runProcess } from '../utils/processes.js';
import { parseNumstat, sampleDiff } from './diff.js';
import { parseHistory } from './history.js';
import { parseNameStatus } from './status.js';

export class GitRepository {
  public constructor(private readonly cwd = process.cwd()) {}

  private git(args: string[], maxBuffer?: number) {
    return runProcess('git', args, { cwd: this.cwd, ...(maxBuffer ? { maxBuffer } : {}) });
  }

  public async isRepository(): Promise<boolean> {
    const result = await this.git(['rev-parse', '--is-inside-work-tree']);
    return result.exitCode === 0 && result.stdout.trim() === 'true';
  }

  public async hasStagedChanges(): Promise<boolean> {
    const result = await this.git(['diff', '--cached', '--quiet']);
    return result.exitCode === 1;
  }

  public async snapshot(): Promise<RepositorySnapshot> {
    const [names, numstat, diff, branch, history] = await Promise.all([
      this.git(['diff', '--cached', '--name-status', '-z']),
      this.git(['diff', '--cached', '--numstat']),
      this.git(['diff', '--cached', '--no-ext-diff', '--binary']),
      this.git(['branch', '--show-current']),
      this.git(['log', '-300', '--pretty=format:%s']),
    ]);
    const sampled = sampleDiff(diff.stdout);
    return {
      files: parseNameStatus(names.stdout),
      diff: sampled.diff,
      branch: branch.stdout.trim(),
      recentCommits: history.exitCode === 0 ? parseHistory(history.stdout) : [],
      stats: parseNumstat(numstat.stdout),
      truncated: sampled.truncated,
    };
  }

  public async commit(message: string): Promise<{ ok: boolean; output: string }> {
    const result = await this.git(['commit', '-m', message]);
    return { ok: result.exitCode === 0, output: (result.stdout || result.stderr).trim() };
  }

  public async hasUpstream(): Promise<boolean> {
    const result = await this.git([
      'rev-parse',
      '--abbrev-ref',
      '--symbolic-full-name',
      '@{upstream}',
    ]);
    return result.exitCode === 0;
  }

  public async push(): Promise<{ ok: boolean; output: string }> {
    const result = await this.git(['push']);
    return { ok: result.exitCode === 0, output: (result.stdout || result.stderr).trim() };
  }
}
