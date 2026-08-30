const content = `# GitHint

> GitHint is a free, open-source, local command-line tool that generates Conventional Commit suggestions from staged Git changes without AI, cloud services, API keys, accounts, or telemetry.

Canonical website: https://githint.theatom.lk
Source code: https://github.com/zakisheriff/GitHint
Package: https://www.npmjs.com/package/githint
License: MIT
Author: Zaki Sheriff

## What GitHint does

GitHint reads staged Git metadata and a size-limited staged diff. It uses deterministic weighted heuristics based on file categories, changed paths, Git statuses, branch hints, diff patterns, and code identifiers. It ranks concise Conventional Commit candidates such as "feat: add mobile navigation" or "fix(auth): handle missing session user".

## Privacy

GitHint runs entirely on the developer's computer. It contains no HTTP client for analysis, sends no source code or diffs anywhere, collects no telemetry, requires no account, and stores no repository contents.

## Installation

npm install -g githint

The package name is githint. The executable command is ghint.

## Primary usage

git add .
ghint

## Commands and options

- ghint: generate a suggestion and open the interactive commit flow
- ghint suggest: generate a suggestion without committing
- ghint commit: explicitly use the interactive commit flow
- ghint --plain: print only the message
- ghint --yes: commit without interactive confirmation
- ghint --type <type>: force a Conventional Commit type
- ghint --scope: include an inferred scope when reliable
- ghint --push: push after committing through the existing upstream
- ghint config: view or update local user configuration

## Supported commit types

feat, fix, refactor, style, docs, test, chore, perf, build, ci, and revert.

## Important behavior

GitHint never stages files automatically. When staged changes are unrelated, it uses a broad truthful suggestion and recommends separate commits. It never silently creates a Git upstream or pushes unless the developer explicitly uses --push.
`;

export function GET() {
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
