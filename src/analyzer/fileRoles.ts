import type { ChangedFile } from '../types/index.js';

/**
 * A commit usually touches more files than it has intent. A bug fix arrives with
 * its regression test, a feature arrives with a lockfile bump. Roles let the
 * analyzer read intent from the files that carry it and treat the rest as
 * collateral.
 */
export type FileRole = 'source' | 'test' | 'docs' | 'style' | 'ci' | 'build' | 'meta' | 'generated';

const GENERATED =
  /(^|\/)(dist|build|out|coverage|vendor|node_modules|__snapshots__)\/|\.(?:min\.(?:js|css)|snap)$/i;
const LOCKFILE =
  /(^|\/)(package-lock\.json|npm-shrinkwrap\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?|composer\.lock|gemfile\.lock|poetry\.lock|cargo\.lock|go\.sum|pubspec\.lock|uv\.lock)$/i;
const DOCUMENTATION =
  /(^|\/)(readme|changelog|contributing|license|authors|codeowners)(\.|$)|(^|\/)docs?\//i;
const DOCUMENTATION_EXT = /\.(md|mdx|rst|adoc|txt)$/i;
const STYLES = /\.(css|scss|sass|less|styl)$/i;
const TESTS =
  /(^|\/)(__tests__|__mocks__|tests?|spec|e2e|cypress|playwright|fixtures)(\/|$)|[._-](test|spec)\.[^.]+$|(^|\/)test_[^/]+\.py$/i;
const CI =
  /(^|\/)(\.github\/workflows|\.circleci|\.gitlab|\.buildkite)(\/|$)|(^|\/)(\.gitlab-ci\.yml|jenkinsfile|azure-pipelines\.yml|\.travis\.yml|netlify\.toml|vercel\.json)$/i;
const BUILD =
  /(^|\/)(dockerfile[^/]*|docker-compose[^/]*|makefile|justfile|rakefile|procfile)$|(^|\/)[^/]*\.(?:config|conf)\.(?:js|ts|mjs|cjs)$|(^|\/)(webpack|vite|rollup|esbuild|tsup|next|nuxt|astro|svelte|babel|jest|vitest|tailwind|postcss)\.config\./i;
const META =
  /(^|\/)(package\.json|deno\.json|tsconfig[^/]*\.json|jsconfig\.json|\.gitignore|\.gitattributes|\.editorconfig|\.npmrc|\.nvmrc|\.env[^/]*|\.prettierrc[^/]*|\.eslintrc[^/]*|eslint\.config\.[^/]+|pyproject\.toml|setup\.cfg|requirements[^/]*\.txt|go\.mod|cargo\.toml|gemfile|pubspec\.yaml)$/i;

const SOURCE_EXTENSIONS = new Set([
  'ts',
  'tsx',
  'js',
  'jsx',
  'mjs',
  'cjs',
  'mts',
  'cts',
  'vue',
  'svelte',
  'astro',
  'py',
  'rb',
  'go',
  'rs',
  'java',
  'kt',
  'kts',
  'swift',
  'm',
  'mm',
  'c',
  'h',
  'cc',
  'cpp',
  'hpp',
  'cs',
  'php',
  'ex',
  'exs',
  'erl',
  'scala',
  'clj',
  'dart',
  'lua',
  'sh',
  'bash',
  'zsh',
  'sql',
  'graphql',
  'gql',
  'proto',
]);

export function roleForFile(file: ChangedFile): FileRole {
  const path = file.path;
  if (LOCKFILE.test(path) || GENERATED.test(path)) return 'generated';
  if (CI.test(path)) return 'ci';
  if (TESTS.test(path)) return 'test';
  if (DOCUMENTATION.test(path) || DOCUMENTATION_EXT.test(path)) return 'docs';
  if (STYLES.test(path)) return 'style';
  if (BUILD.test(path)) return 'build';
  if (META.test(path)) return 'meta';
  if (file.extension && SOURCE_EXTENSIONS.has(file.extension)) return 'source';
  return 'meta';
}

/**
 * Higher tiers describe intent more strongly. Only the files in the highest tier
 * present get a vote, so a lockfile never outranks the function it was bumped for.
 */
const TIERS: Record<FileRole, number> = {
  source: 4,
  test: 3,
  docs: 3,
  style: 3,
  ci: 2,
  build: 2,
  meta: 1,
  generated: 0,
};

export function tierForRole(role: FileRole): number {
  return TIERS[role];
}

export interface RoledFile {
  file: ChangedFile;
  role: FileRole;
}

/**
 * Files whose role sits in the highest tier present — the ones that carry intent.
 * Weighting by line count instead was tried and measured worse: lockfiles and
 * generated output dominate churn while saying nothing about why a commit exists.
 */
export function intentFiles(files: ChangedFile[]): RoledFile[] {
  const roled = files.map((file) => ({ file, role: roleForFile(file) }));
  const highest = Math.max(...roled.map((entry) => TIERS[entry.role]), 0);
  const selected = roled.filter((entry) => TIERS[entry.role] === highest);

  return selected.length > 0 ? selected : roled;
}
