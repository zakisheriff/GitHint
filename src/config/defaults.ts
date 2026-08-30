import type { GitHintConfig } from './config.js';

export const DEFAULT_CONFIG: GitHintConfig = {
  conventional: true,
  scope: 'auto',
  maxLength: 72,
  showStats: true,
  confirmCommit: true,
};
