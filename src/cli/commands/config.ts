import {
  configPath,
  type ConfigKey,
  parseConfigValue,
  readConfig,
  resetConfig,
  writeConfig,
} from '../../config/config.js';
import { DEFAULT_CONFIG } from '../../config/defaults.js';

function isConfigKey(value: string): value is ConfigKey {
  return value in DEFAULT_CONFIG;
}

export async function showConfig(key?: string): Promise<void> {
  const config = await readConfig();
  if (key) {
    if (!isConfigKey(key)) throw new Error(`Unknown configuration key: ${key}`);
    process.stdout.write(`${String(config[key])}\n`);
    return;
  }
  process.stdout.write(`${JSON.stringify(config, null, 2)}\n\n${configPath()}\n`);
}

export async function setConfig(key: string, value: string): Promise<void> {
  if (!isConfigKey(key)) throw new Error(`Unknown configuration key: ${key}`);
  const config = await readConfig();
  Object.assign(config, { [key]: parseConfigValue(key, value) });
  await writeConfig(config);
  process.stdout.write(`Set ${key} to ${String(config[key])}.\n`);
}

export async function resetUserConfig(): Promise<void> {
  await resetConfig();
  process.stdout.write('GitHint configuration reset.\n');
}
