# <div align="center">GitHint</div>

<div align="center">
<strong>100% Free, Local Git Commit Message Suggestions — No AI Required</strong>
</div>

<br />

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-56%20Tests-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<br />

<a href="https://githint.theatom.lk">
<img src="https://img.shields.io/badge/View%20Live%20Site-Click%20Here-1f883d?style=for-the-badge&logo=safari&logoColor=white" height="50" />
</a>

<br />
<br />

**[Visit Live Site: https://githint.theatom.lk](https://githint.theatom.lk)**

</div>

<br />

> **"Your diff already knows what changed."**
>
> GitHint is not another AI wrapper. It is a fast, deterministic developer utility that turns staged Git changes into clean Conventional Commit suggestions—entirely on your machine.

---

## 🌟 Vision

GitHint's mission is to be:

- **A completely free developer utility** — no subscriptions, quotas, or paid tiers
- **A privacy-first local tool** — source code and diffs never leave your computer
- **A polished Unix-style CLI** that fits naturally between `git add` and `git commit`

---

## ✨ Why GitHint?

Developers regularly pause at `git commit -m ""` and waste time turning code changes into a concise message. GitHint removes that interruption by reading the context already present in the staged diff and proposing a useful Conventional Commit in milliseconds.

---

## 🎨 GitHub-Inspired Developer Experience

- **Minimal Terminal Interface**  
  A focused prompt with no oversized banners, unnecessary animation, or distracting color.

- **Repository-Aware Presentation**  
  File counts, additions, deletions, inferred scope, and a ranked commit suggestion appear together.

- **Direct Keyboard Actions**  
  Press Enter to commit, `e` to edit, `r` for an alternative, `c` to copy, or `q` to cancel.

- **Responsive Next.js Website**  
  The landing page uses a GitHub-inspired visual language, accessible semantic HTML, and mobile-first layouts.

---

## 🧠 Deterministic Local Intelligence

- **Role-Aware Classification**  
  Files are read by the role they play, and only the ones carrying intent get a vote. A bug fix
  arrives with its regression test and a feature arrives with a lockfile bump — neither the test
  nor the lockfile is allowed to outrank the source change it shipped with.

- **Shape Analysis**  
  New files and new exports read as features, edits to existing code read as fixes, and churn that
  adds and removes in equal measure without changing the public surface reads as a refactor.

- **Convention Learning**  
  The same dependency bump is filed as `build:` in Angular, `chore:` in NestJS and `fix:` under
  Renovate's defaults. No diff can settle that, so GitHint reads your own `git log` and follows the
  convention already in use.

- **Ranked Identifier Extraction**  
  Recognizes functions, classes, components, interfaces and types across several languages, then
  ranks them so the subject names the headline symbol rather than the first helper that matched.

- **Deterministic Alternatives**  
  `r` cycles through ranked candidates that span commit _types_, not just wordings — all from the
  same local analysis, with no network requests.

---

## 📊 Measured Accuracy

Commit type is a statement about intent, and a diff records what changed rather than why. GitHint is
measured rather than asserted: each commit from real repositories is replayed by staging its diff and
comparing the suggestion against what the author actually wrote.

| Corpus   | Repositories                    | Commits | Correct type | Correct type offered |
| -------- | ------------------------------- | ------- | ------------ | -------------------- |
| Tuning   | commitlint, vite, cz-cli        | 348     | **72.1%**    | **81.3%**            |
| Held-out | angular, nest, semantic-release | 255     | **60.4%**    | **76.5%**            |

The held-out repositories were never used while tuning; accuracy there rose from 40.8% to 60.4%,
which is the honest measure of how well the heuristics generalize. "Correct type offered" is how
often the right type is among the alternatives `r` cycles through.

Deterministic categories are reliable — documentation scores 94%, packaging chores 82%. The
irreducible cases are `feat` / `fix` / `refactor`, which can edit identical lines with different
intent; GitHint flags those as ambiguous rather than bluffing, and puts the alternatives one
keystroke away.

**GitHint drafts the message; you approve it.** That is the intended workflow, and `e` edits any
suggestion before it is committed.

---

## 🔐 Privacy-First Architecture

- **No AI or LLM APIs**  
  No OpenAI, Gemini, Claude, or remote inference.

- **No Source Uploads**  
  Staged diffs remain in memory and never leave the local computer.

- **No Accounts or API Keys**  
  Install the package and use it immediately.

- **No Telemetry**  
  GitHint contains no analytics, tracking, or background network requests.

---

## ⚡ Complete Developer Workflow

- **Staged Change Analysis**  
  Reads only the files intentionally staged with Git.

- **Conventional Commit Support**  
  Generates `feat`, `fix`, `refactor`, `style`, `docs`, `test`, `chore`, `perf`, `build`, `ci`, and `revert` messages.

- **Automatic Scope Detection**  
  Infers reliable scopes from dominant modules and repository conventions.

- **Script-Friendly Output**  
  `--plain` prints only the generated commit message.

- **Safe Commit Execution**  
  Uses `execFile` argument arrays instead of interpolated shell commands.

- **Explicit Push Support**  
  `--push` uses an existing branch upstream and never silently creates one.

---

## 📁 Project Structure

```text
GitHint/
├── src/                              # TypeScript CLI source
│   ├── analyzer/                     # Weighted heuristic engine
│   │   ├── analyzeChanges.ts         # Builds the complete change analysis
│   │   ├── determineScope.ts         # Meaningful scope inference
│   │   ├── diffRules.ts              # Diff pattern signals
│   │   ├── extractIdentifiers.ts     # Cross-language identifier extraction
│   │   ├── fileRules.ts              # File category rules
│   │   └── generateDescription.ts    # Concise subject generation
│   ├── cli/                          # Commander.js interface
│   │   ├── commands/                 # Suggest, commit, and config commands
│   │   ├── index.ts                  # CLI command registration
│   │   └── options.ts                # Shared flags
│   ├── config/                       # Cross-platform local configuration
│   ├── generator/                    # Candidate creation and formatting
│   ├── git/                          # Safe Git repository operations
│   ├── terminal/                     # Rendering, interaction, and clipboard
│   ├── types/                        # Shared TypeScript contracts
│   └── utils/                        # Process, path, and string helpers
│
├── tests/                            # Unit and integration coverage
│   ├── analyzer/                     # Classification and generation tests
│   ├── git/                          # Git parser tests
│   └── integration/                  # Isolated temporary repositories
│
└── website/                          # Next.js landing page
    ├── app/                          # App Router pages and metadata routes
    ├── components/                   # Reusable UI components
    ├── public/                       # Brand and social preview assets
    └── .openai/hosting.json          # Hosting configuration
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v20+)
- **Git** installed and available in your terminal
- **macOS, Linux, or Windows**

### 1. Install GitHint

```bash
npm install -g githint
```

### 2. Stage Your Changes

```bash
git add .
```

### 3. Generate a Commit Hint

```bash
githint
```

### 4. Development Setup

```bash
git clone https://github.com/zakisheriff/GitHint.git
cd GitHint
npm install
npm run build
npm test
```

### 5. Run the Landing Page

```bash
cd website
npm install
npm run dev
```

Visit **http://localhost:3000** 🎉

---

## 🎯 Key Features

### Interactive Workflow

✅ **Instant Suggestions** — Generate a ranked message from staged changes  
✅ **Inline Editing** — Refine the suggestion before committing  
✅ **Deterministic Alternatives** — Cycle through meaningful candidates  
✅ **Clipboard Support** — Copy through native platform tools  
✅ **Optional Commit and Push** — Perform only the actions you explicitly request  
✅ **Unrelated Change Warning** — Know when staged work should become separate commits

### Automation and Configuration

✅ **Plain Output** — Use GitHint inside scripts and aliases  
✅ **Forced Types** — Override classification with `--type`  
✅ **Inferred Scopes** — Add repository-aware scopes with `--scope`  
✅ **Cross-Platform Config** — Store preferences in the appropriate user config directory  
✅ **Length Limits** — Keep suggestions within a configurable maximum  
✅ **Repository Style Detection** — Learn scoped commit style from recent local history

---

## 🔧 Tech Stack

### CLI

- **TypeScript** — Strict, maintainable source code
- **Node.js** — Cross-platform command-line runtime
- **Commander.js** — CLI commands and options
- **Inquirer** — Lightweight editing and confirmation prompts
- **Chalk** — Minimal terminal formatting
- **tsup** — Fast ESM production bundling

### Website

- **Next.js App Router** — Metadata-first React website architecture
- **React** — Interactive copy controls and reusable UI
- **Tailwind CSS** — Responsive design system
- **shadcn/ui** — Accessible interface primitives
- **Lucide** — Consistent developer-focused icons

### Quality

- **Vitest** — Unit and isolated Git integration tests
- **ESLint** — Static code quality
- **Prettier** — Consistent formatting
- **TypeScript strict mode** — Compile-time correctness

---

## 📊 Analysis Model

GitHint combines several signal groups:

- **Git metadata** — added, modified, deleted, and renamed files
- **File semantics** — documentation, styles, tests, CI, build, and configuration
- **Directory structure** — meaningful feature and module names
- **Diff patterns** — guards, validation, errors, event handlers, caching, and exports
- **Identifiers** — functions, classes, components, interfaces, and types
- **Branch hints** — `fix/`, `bug/`, and `hotfix/` branches
- **Repository history** — recent local commit style only
- **Candidate quality** — specificity, concision, dominant concepts, and generic-word penalties

---

## 🔒 Security & Privacy Features

✅ **Local-Only Analysis** — Source code never leaves the machine  
✅ **No HTTP Analysis Client** — No remote inference or hidden API request  
✅ **No Diff Persistence** — Repository contents are not written to configuration or logs  
✅ **Safe Process Execution** — Git receives explicit argument arrays  
✅ **Binary Diff Handling** — Binary content is ignored while filenames remain useful  
✅ **Large Diff Sampling** — Oversized staged diffs are safely bounded  
✅ **Explicit Network Action** — Only user-requested `git push` can access the network

---

## 📜 CLI Documentation

### Main Commands

- `githint` — Generate a suggestion and open the interactive commit flow
- `githint suggest` — Generate a suggestion without committing
- `githint commit` — Explicitly open the interactive commit flow
- `githint config` — View local configuration and its path
- `githint config get [key]` — Read configuration
- `githint config set <key> <value>` — Update configuration
- `githint config reset` — Restore defaults

### Options

- `--plain` — Print only the generated commit message
- `-y, --yes` — Commit immediately without confirmation
- `--type <type>` — Force a Conventional Commit type
- `--scope` — Include an inferred scope when reliable
- `--push` — Push after a successful commit
- `-V, --version` — Print the installed version

---

## 🌐 Deployment

### CLI Package (npm)

1. Run `npm run build`
2. Run `npm test`
3. Verify with `npm pack --dry-run`
4. Publish the `githint` package

### Landing Page

1. Open the `website` directory
2. Run `npm run build`
3. Deploy the generated production output
4. Point `githint.theatom.lk` to the hosting provider

---

## 🤝 Contributing

Contributions are welcome! Please feel free to open an issue or submit a Pull Request.

---

## 📄 License

MIT License — 100% Free and Open Source

---

## ☕️ Support the Project

If GitHint saved you time or improved your Git workflow:

- Consider buying me a coffee
- It keeps development alive and motivates future updates

<div align="center">
<a href="https://buymeacoffee.com/theoneatom">
<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="60" width="217" alt="Buy me a coffee" />
</a>
</div>

---

<p align="center">
Made by <strong>Zaki Sheriff</strong>
</p>

<p align="center">
<em>Because commit messages should not interrupt the flow.</em>
</p>
