import path from 'node:path';

import type { ChangedFile, FileStatus } from '../types/index.js';
import { toNaturalWords } from './strings.js';

const GENERIC_SEGMENTS = new Set([
  'src',
  'lib',
  'app',
  'apps',
  'components',
  'component',
  'pages',
  'page',
  'routes',
  'route',
  'index',
  'main',
  'utils',
  'utility',
  'helpers',
  'helper',
  'types',
  'constants',
  'config',
  'test',
  'tests',
  '__tests__',
]);

export function createChangedFile(
  filePath: string,
  status: FileStatus,
  previousPath?: string,
): ChangedFile {
  const normalized = filePath.replaceAll('\\', '/');
  const parsed = path.posix.parse(normalized);
  const result: ChangedFile = {
    path: normalized,
    status,
    basename: parsed.name,
    directory: parsed.dir,
  };
  if (previousPath) result.previousPath = previousPath;
  if (parsed.ext) result.extension = parsed.ext.slice(1).toLowerCase();
  return result;
}

export function conceptFromPath(filePath: string): string | undefined {
  const normalized = filePath.replaceAll('\\', '/');
  const parsed = path.posix.parse(normalized);
  const segments = [...parsed.dir.split('/'), parsed.name].filter(Boolean).reverse();
  const meaningful = segments.find((segment) => !GENERIC_SEGMENTS.has(segment.toLowerCase()));
  return meaningful ? toNaturalWords(meaningful) : undefined;
}

export function meaningfulDirectory(filePath: string): string | undefined {
  const segments = filePath.replaceAll('\\', '/').split('/').slice(0, -1);
  const meaningful = segments.find((segment) => !GENERIC_SEGMENTS.has(segment.toLowerCase()));
  return meaningful?.toLowerCase();
}

export function isGenericConcept(value: string): boolean {
  return GENERIC_SEGMENTS.has(value.replaceAll(' ', '').toLowerCase());
}
