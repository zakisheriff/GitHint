import { analyzeChanges } from '../../analyzer/analyzeChanges.js';
import { readConfig } from '../../config/config.js';
import { generateCandidates } from '../../generator/commitGenerator.js';
import { prefersScopes } from '../../git/history.js';
import { GitRepository } from '../../git/repository.js';
import { renderSuggestion } from '../../terminal/renderer.js';
import type { ChangeAnalysis, CommitCandidate } from '../../types/index.js';
import type { CliOptions } from '../options.js';

export interface SuggestionContext {
  repository: GitRepository;
  analysis: ChangeAnalysis;
  candidates: CommitCandidate[];
  showStats: boolean;
}

export async function createSuggestion(
  options: CliOptions,
): Promise<SuggestionContext | undefined> {
  const repository = new GitRepository();
  if (!(await repository.isRepository())) {
    process.stderr.write('GitHint: This directory is not a Git repository.\n');
    process.exitCode = 1;
    return undefined;
  }
  if (!(await repository.hasStagedChanges())) {
    process.stderr.write(
      'GitHint: No staged changes found.\n\nStage your changes first:\n\n  git add .\n',
    );
    process.exitCode = 1;
    return undefined;
  }

  const [snapshot, config] = await Promise.all([repository.snapshot(), readConfig()]);
  const analysis = analyzeChanges(snapshot);
  const autoScope =
    config.scope === 'always' ||
    (config.scope === 'auto' &&
      prefersScopes(snapshot.recentCommits) &&
      analysis.confidence > 0.75);
  const candidates = generateCandidates(analysis, {
    ...(options.type ? { type: options.type } : {}),
    includeScope: options.scope || autoScope,
    maxLength: config.maxLength,
  });
  return { repository, analysis, candidates, showStats: config.showStats };
}

export async function runSuggest(options: CliOptions): Promise<void> {
  const context = await createSuggestion(options);
  const candidate = context?.candidates[0];
  if (!context || !candidate) return;
  if (options.plain) process.stdout.write(`${candidate.message}\n`);
  else renderSuggestion(candidate.message, context.analysis, context.showStats);
}
