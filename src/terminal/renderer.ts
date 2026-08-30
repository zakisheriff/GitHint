import chalk from 'chalk';

import type { ChangeAnalysis } from '../types/index.js';

export function brand(): string {
  return `${chalk.bold('Git')}${chalk.dim('Hint')}`;
}

export function renderSuggestion(
  message: string,
  analysis: ChangeAnalysis,
  showStats: boolean,
): void {
  process.stdout.write(`${brand()}\n\n`);
  if (showStats) {
    const { files, additions, deletions } = analysis.stats;
    process.stdout.write(
      `${files} staged ${files === 1 ? 'file' : 'files'} · ${additions} additions · ${deletions} deletions\n\n`,
    );
  }
  process.stdout.write(`${chalk.dim('Suggested')}\n\n  ${chalk.bold(message)}\n\n`);
  if (analysis.unrelatedChanges) {
    process.stdout.write(
      `${chalk.yellow('!')} Multiple unrelated change groups detected. Consider separate commits.\n\n`,
    );
  }
}

export function renderSuccess(message: string, pushed: boolean): void {
  process.stdout.write(`\n${chalk.green('✓')} Committed\n`);
  if (pushed) process.stdout.write(`${chalk.green('✓')} Pushed\n`);
  process.stdout.write(`\n${message}\n`);
}
