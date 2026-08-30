<p align="center">
  <img src="./githint-logo.png" alt="GitHint" width="420" />
</p>

<p align="center"><strong>Stop thinking about commit messages.</strong></p>

```console
$ git add .
$ ghint

  feat: add mobile navigation

  Enter to commit.
```

GitHint reads your staged Git changes and suggests a concise Conventional Commit. It uses deterministic local heuristics—file names, directories, Git metadata, diff patterns, and code identifiers—to turn your diff into a useful commit hint.

**GitHint runs entirely on your machine. Your source code never leaves your computer.**

- ✓ No AI
- ✓ No API keys
- ✓ No cloud
- ✓ No telemetry
- ✓ Works offline
- ✓ Your code stays on your machine

## Install

GitHint requires Node.js 20 or newer.

```bash
npm install -g githint
```

You can also run it without a global installation:

```bash
npx githint
```

The npm package name is `githint`; the executable is `ghint` so it does not conflict with the GitHub CLI's `gh` command.

## Use

Stage the changes you want to commit, then run GitHint:

```bash
git add .
ghint
```

```text
GitHint

3 staged files · 42 additions · 8 deletions

Suggested

  feat: add mobile navigation

Enter  commit
e      edit
r      alternative
c      copy
q      cancel
```

Press Enter to commit, edit the message, cycle through deterministic alternatives, copy the suggestion, or cancel. GitHint never stages files for you.

### Commands

```bash
ghint                 # suggest and interactively commit
ghint suggest         # show a suggestion without committing
ghint commit          # explicitly use the interactive commit flow
ghint config          # show configuration and its file location
ghint config get      # show all configuration
ghint config get scope
ghint config set scope always
ghint config reset
```

### Options

| Option          | Purpose                                             |
| --------------- | --------------------------------------------------- |
| `--plain`       | Print only the generated message for scripts        |
| `-y, --yes`     | Commit immediately without interactive confirmation |
| `--type <type>` | Force a Conventional Commit type                    |
| `--scope`       | Include an inferred scope when one is reliable      |
| `--push`        | Push after a successful commit                      |
| `-V, --version` | Print the installed version                         |

Supported types are `feat`, `fix`, `refactor`, `style`, `docs`, `test`, `chore`, `perf`, `build`, `ci`, and `revert`.

Examples:

```bash
ghint suggest --plain
ghint --yes
ghint --type fix
ghint --scope
ghint --yes --push
```

`--push` uses the branch's existing upstream. If the branch has no upstream, GitHint leaves the commit intact and tells you the explicit `git push --set-upstream` command to use. It never silently chooses or creates an upstream.

## What GitHint analyzes

GitHint runs a small set of read-only Git commands against the current repository:

```text
git diff --cached
git diff --cached --name-status
git diff --cached --numstat
git branch --show-current
git log -10 --pretty=format:%s
```

The scoring engine combines:

- file categories such as documentation, tests, styles, CI, build, and configuration;
- added, modified, deleted, and renamed files;
- code patterns for guards, validation, event handlers, exports, caching, and refactors;
- function, class, component, interface, and type names from common languages;
- meaningful module names from paths;
- branch hints such as `fix/`, `bug/`, and `hotfix/`;
- recent commit style for conservative automatic scope use.

GitHint does not parse your whole repository. It only examines staged metadata and a size-limited staged diff. Binary contents are ignored, and oversized diffs are sampled safely.

## Conventional Commits

[Conventional Commits](https://www.conventionalcommits.org/) use a predictable structure:

```text
type(optional-scope): concise description
```

Examples:

```text
feat: add responsive navigation
fix(auth): prevent duplicate login requests
style: adjust dashboard spacing
docs: update installation instructions
refactor: extract authentication helpers
test: add checkout validation tests
chore: update dependencies
```

GitHint uses Conventional Commits by default because they are readable, searchable, and useful for release automation.

## Configuration

User configuration is stored at `~/.config/githint/config.json` on macOS/Linux, `%APPDATA%/githint/config.json` on Windows, or beneath `$XDG_CONFIG_HOME` when it is set.

```json
{
  "conventional": true,
  "scope": "auto",
  "maxLength": 72,
  "showStats": true,
  "confirmCommit": true
}
```

`scope` accepts `auto`, `always`, or `never`. `maxLength` accepts values from 30 to 200. Boolean settings accept `true` or `false`.

## Privacy and security

GitHint contains no HTTP client and makes no external requests. It does not upload, persist, or log diffs; create accounts; collect analytics; or send telemetry. The only network operation it can perform is the explicit `git push` you request with `--push`.

Commits are executed without a shell:

```text
git commit -m <message>
```

This avoids shell interpolation and command injection. Clipboard support is optional and uses `pbcopy`, `wl-copy`, `xclip`, or `clip` when available.

## Develop

```bash
git clone https://github.com/zakisheriff/GitHint.git
cd GitHint
npm install
npm run build
npm test
```

Available scripts:

```bash
npm run dev -- suggest --plain
npm run build
npm run typecheck
npm run test
npm run test:watch
npm run lint
npm run format
```

Test the command globally during development:

```bash
npm link

# In another Git repository:
git add .
ghint
```

The test suite creates isolated temporary Git repositories and never relies on your working repository.

## Philosophy

> Your diff already knows what changed. GitHint turns that into the commit hint.

## License

[MIT](./LICENSE)
