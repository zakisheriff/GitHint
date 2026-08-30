import type { ChangedFile, FileStatus } from '../types/index.js';
import { createChangedFile } from '../utils/paths.js';

function normalizeStatus(code: string): FileStatus {
  if (code.startsWith('A')) return 'added';
  if (code.startsWith('D')) return 'deleted';
  if (code.startsWith('R') || code.startsWith('C')) return 'renamed';
  return 'modified';
}

export function parseNameStatus(output: string): ChangedFile[] {
  const tokens = output.split('\0').filter(Boolean);
  const files: ChangedFile[] = [];
  for (let index = 0; index < tokens.length;) {
    const code = tokens[index++] ?? 'M';
    const status = normalizeStatus(code);
    if (status === 'renamed') {
      const previousPath = tokens[index++];
      const currentPath = tokens[index++];
      if (previousPath && currentPath)
        files.push(createChangedFile(currentPath, status, previousPath));
    } else {
      const filePath = tokens[index++];
      if (filePath) files.push(createChangedFile(filePath, status));
    }
  }
  return files;
}
