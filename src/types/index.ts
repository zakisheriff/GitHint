export const COMMIT_TYPES = [
  'feat',
  'fix',
  'refactor',
  'style',
  'docs',
  'test',
  'chore',
  'perf',
  'build',
  'ci',
  'revert',
] as const;

export type CommitType = (typeof COMMIT_TYPES)[number];
export type FileStatus = 'added' | 'modified' | 'deleted' | 'renamed';

export interface ChangedFile {
  path: string;
  previousPath?: string;
  status: FileStatus;
  extension?: string;
  basename: string;
  directory: string;
}

export interface DiffStats {
  files: number;
  additions: number;
  deletions: number;
}

export interface RepositorySnapshot {
  files: ChangedFile[];
  diff: string;
  branch: string;
  recentCommits: string[];
  stats: DiffStats;
  truncated: boolean;
}

export interface ChangeAnalysis {
  files: ChangedFile[];
  addedFiles: string[];
  modifiedFiles: string[];
  deletedFiles: string[];
  categories: CommitType[];
  primaryCategory: CommitType;
  identifiers: string[];
  concepts: string[];
  likelyScope?: string;
  scores: Record<CommitType, number>;
  confidence: number;
  unrelatedChanges: boolean;
  stats: DiffStats;
}

export interface CommitCandidate {
  type: CommitType;
  scope?: string;
  description: string;
  message: string;
  score: number;
}

export interface GenerateOptions {
  type?: CommitType;
  includeScope?: boolean;
  maxLength?: number;
  conventional?: boolean;
}
