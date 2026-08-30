import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { DEFAULT_CONFIG } from './defaults.js';

export interface GitHintConfig {
  conventional: boolean;
  scope: 'auto' | 'always' | 'never';
  maxLength: number;
  showStats: boolean;
  confirmCommit: boolean;
}

export type ConfigKey = keyof GitHintConfig;

export function configPath(): string {
  const base = process.platform === 'win32' ? process.env.APPDATA : process.env.XDG_CONFIG_HOME;
  return path.join(base || path.join(os.homedir(), '.config'), 'githint', 'config.json');
}

export async function readConfig(): Promise<GitHintConfig> {
  try {
    const parsed = JSON.parse(await readFile(configPath(), 'utf8')) as Partial<GitHintConfig>;
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return { ...DEFAULT_CONFIG };
    throw new Error('Could not read the GitHint configuration.');
  }
}

export async function writeConfig(config: GitHintConfig): Promise<void> {
  const target = configPath();
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(config, null, 2)}\n`, { mode: 0o600 });
}

export function parseConfigValue(key: ConfigKey, raw: string): GitHintConfig[ConfigKey] {
  if (key === 'maxLength') {
    const value = Number.parseInt(raw, 10);
    if (!Number.isInteger(value) || value < 30 || value > 200)
      throw new Error('maxLength must be between 30 and 200.');
    return value;
  }
  if (key === 'scope') {
    if (!['auto', 'always', 'never'].includes(raw))
      throw new Error('scope must be auto, always, or never.');
    return raw as GitHintConfig['scope'];
  }
  if (raw !== 'true' && raw !== 'false') throw new Error(`${key} must be true or false.`);
  return raw === 'true';
}

export async function resetConfig(): Promise<void> {
  await rm(configPath(), { force: true });
}
