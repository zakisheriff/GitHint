import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { VERSION } from '../src/version.js';

describe('VERSION', () => {
  it('matches the version published in package.json', () => {
    const manifest = JSON.parse(
      readFileSync(path.resolve(import.meta.dirname, '..', 'package.json'), 'utf8'),
    ) as { version: string };
    expect(VERSION).toBe(manifest.version);
  });
});
