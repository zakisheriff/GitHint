import {
  Braces,
  Check,
  ChevronRight,
  Code2,
  FileDiff,
  GitBranch,
  GitCommitHorizontal,
  GitFork,
  KeyRound,
  LockKeyhole,
  Network,
  PackageCheck,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Star,
  WifiOff,
  Zap,
} from 'lucide-react';

import { InstallCommand } from '@/components/install-command';

const privacyChecks = ['No AI', 'No API keys', 'No telemetry', 'Works offline'];

const stats = [
  ['0 bytes', 'uploaded'],
  ['11', 'commit types'],
  ['3–8 words', 'per suggestion'],
  ['100%', 'local'],
];

const steps = [
  {
    number: '01',
    icon: GitBranch,
    title: 'Stage your changes',
    body: 'Use Git exactly as you already do. GitHint analyzes only the files you intentionally stage.',
    command: 'git add .',
  },
  {
    number: '02',
    icon: ScanSearch,
    title: 'Run one command',
    body: 'GitHint reads staged metadata, filenames, directories, diff patterns, and code identifiers.',
    command: 'ghint',
  },
  {
    number: '03',
    icon: GitCommitHorizontal,
    title: 'Commit with confidence',
    body: 'Accept the ranked suggestion, edit it, copy it, or cycle through deterministic alternatives.',
    command: 'feat: add mobile navigation',
  },
];

const features = [
  {
    icon: Zap,
    title: 'Instant by design',
    body: 'Small, focused Git reads keep the common path fast—without waiting on a model or network.',
  },
  {
    icon: ShieldCheck,
    title: 'Private by architecture',
    body: 'Diffs stay in memory, remain on your machine, and are never saved, logged, or uploaded.',
  },
  {
    icon: Braces,
    title: 'Deterministic heuristics',
    body: 'Weighted rules combine Git metadata, file semantics, branch hints, and extracted identifiers.',
  },
  {
    icon: Sparkles,
    title: 'Specific suggestions',
    body: 'Turns names like MobileMenu and handleUserLogin into concise, natural commit subjects.',
  },
  {
    icon: Network,
    title: 'Repository-aware',
    body: 'Recent commit history informs style while meaningful directories can become reliable scopes.',
  },
  {
    icon: PackageCheck,
    title: 'Built for scripts',
    body: 'Use --plain, --yes, --type, --scope, or --push in local tools and automated workflows.',
  },
];

const faq = [
  {
    question: 'What is GitHint?',
    answer:
      'GitHint is a free, open-source command-line tool that generates Conventional Commit suggestions from staged Git changes. It runs entirely on your computer.',
  },
  {
    question: 'Does GitHint use AI or send my code anywhere?',
    answer:
      'No. GitHint uses deterministic local heuristics and contains no AI integration, API key requirement, telemetry, account system, or code-upload feature.',
  },
  {
    question: 'How does GitHint generate commit messages?',
    answer:
      'It scores file categories, Git statuses, paths, branch names, diff patterns, and identifiers such as function or component names, then ranks concise candidate messages.',
  },
  {
    question: 'Which operating systems does GitHint support?',
    answer:
      'GitHint targets macOS and Linux terminals and supports Windows where the required Git and Node.js commands are available.',
  },
  {
    question: 'Can GitHint commit or push automatically?',
    answer:
      'Yes, but only when you request it. Use --yes to commit without confirmation and --push to push through the branch’s existing upstream.',
  },
  {
    question: 'What happens when staged changes are unrelated?',
    answer:
      'GitHint prefers a broad, truthful message and warns you to consider separate commits. It never automatically splits or stages changes.',
  },
];

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'GitHint',
  alternateName: 'ghint',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'macOS, Linux, Windows',
  description:
    'A free, local, non-AI CLI that generates Conventional Commit messages from staged Git changes.',
  url: 'https://githint.theatom.lk',
  downloadUrl: 'https://www.npmjs.com/package/githint',
  codeRepository: 'https://github.com/zakisheriff/GitHint',
  softwareVersion: '0.1.0',
  license: 'https://opensource.org/license/mit',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  author: {
    '@type': 'Person',
    name: 'Zaki Sheriff',
    url: 'https://github.com/zakisheriff',
  },
  featureList: [
    'Offline commit suggestions',
    'Conventional Commits',
    'No AI',
    'No telemetry',
    'Local diff analysis',
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <header className="sticky top-0 z-50 border-b border-border/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5 sm:px-8">
          <a
            href="#top"
            className="flex items-center gap-2.5 font-semibold tracking-tight"
            aria-label="GitHint home"
          >
            <span className="grid size-8 place-items-center rounded-full border border-border text-foreground">
              <GitBranch className="size-4" />
            </span>
            <span className="text-lg">GitHint</span>
          </a>
          <nav
            className="hidden items-center gap-7 text-sm text-muted-foreground md:flex"
            aria-label="Main navigation"
          >
            <a href="#how-it-works" className="hover:text-foreground">
              How it works
            </a>
            <a href="#features" className="hover:text-foreground">
              Features
            </a>
            <a href="#install" className="hover:text-foreground">
              Install
            </a>
            <a href="#faq" className="hover:text-foreground">
              FAQ
            </a>
          </nav>
          <a
            href="https://github.com/zakisheriff/GitHint"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium hover:border-foreground"
          >
            <GitFork className="size-4" />
            <span className="hidden sm:inline">View on GitHub</span>
            <Star className="size-3.5 text-muted-foreground" />
          </a>
        </div>
      </header>

      <section
        id="top"
        className="relative isolate border-b border-border/70 px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24"
      >
        <div className="mx-auto max-w-[1120px]">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-balance text-[clamp(3.2rem,9vw,7.4rem)] font-semibold leading-[0.88] tracking-[-0.07em]">
              Your diff already
              <br />
              <span className="text-muted-foreground">knows the message.</span>
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
              GitHint turns staged changes into clean Conventional Commit
              suggestions—instantly, locally, and without AI.
            </p>
            <div id="install" className="scroll-mt-24 pt-10">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Install once. Hint forever.
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                GitHint requires Node.js 20 or newer. The npm package installs
                the <code className="font-mono text-foreground">ghint</code>{' '}
                command globally.
              </p>
              <InstallCommand />
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <LockKeyhole className="size-3.5" /> MIT licensed
                </span>
                <span className="flex items-center gap-2">
                  <WifiOff className="size-3.5" /> Offline-ready
                </span>
                <span className="flex items-center gap-2">
                  <KeyRound className="size-3.5" /> No keys
                </span>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-center">
              <a
                href="#how-it-works"
                className="inline-flex h-12 w-full items-center justify-center rounded-md border border-border px-6 text-sm font-semibold hover:border-foreground sm:w-auto"
              >
                See how it works
              </a>
            </div>
          </div>

          <div className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-xl border border-border bg-white text-foreground shadow-[0_24px_70px_rgba(31,35,40,0.10)] sm:mt-20">
            <div className="flex h-12 items-center justify-between border-b border-border px-4">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Code2 className="size-4" /> zakisheriff / GitHint
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <GitBranch className="size-3.5" /> main
                </span>
                <span className="hidden items-center gap-1.5 sm:flex">
                  <ShieldCheck className="size-3.5" /> local only
                </span>
              </div>
            </div>
            <div className="grid md:grid-cols-[1fr_220px]">
              <div className="min-h-[320px] border-border p-6 font-mono text-sm leading-7 md:border-r sm:p-8">
                <p>
                  <span className="select-none text-muted-foreground">$</span>{' '}
                  git add .
                </p>
                <p>
                  <span className="select-none text-muted-foreground">$</span>{' '}
                  ghint
                </p>
                <div className="my-6 border-l-2 border-foreground pl-5">
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Suggested commit
                  </p>
                  <p className="mt-2 text-base font-semibold text-foreground sm:text-lg">
                    <span className="font-bold">feat:</span> add responsive
                    navigation
                  </p>
                </div>
                <div className="grid max-w-xs grid-cols-[64px_1fr] gap-y-1 text-xs text-muted-foreground sm:text-sm">
                  <span className="text-foreground">Enter</span>
                  <span>commit</span>
                  <span className="text-foreground">e</span>
                  <span>edit</span>
                  <span className="text-foreground">r</span>
                  <span>alternative</span>
                  <span className="text-foreground">q</span>
                  <span>cancel</span>
                </div>
              </div>
              <aside className="border-t border-border p-6 md:border-t-0">
                <p className="mb-4 text-xs font-semibold">Privacy checks</p>
                <ul className="space-y-3 text-xs text-muted-foreground">
                  {privacyChecks.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="grid size-5 place-items-center rounded-full border border-border text-foreground">
                        <Check className="size-3" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label="GitHint facts"
        className="border-b border-border bg-white"
      >
        <div className="mx-auto grid max-w-[1120px] grid-cols-2 divide-x divide-y divide-border border-x border-border sm:grid-cols-4 sm:divide-y-0">
          {stats.map(([value, label]) => (
            <div key={label} className="px-5 py-7 text-center">
              <p className="text-xl font-semibold tracking-tight sm:text-2xl">
                {value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28"
      >
        <div className="mx-auto max-w-[1120px]">
          <SectionHeading
            title="From staged diff to useful hint."
            body="No new workflow to learn. GitHint fits between git add and git commit."
          />
          <div className="mt-12 grid overflow-hidden rounded-xl border border-border md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.number}
                  className={`relative p-7 sm:p-8 ${index > 0 ? 'border-t border-border md:border-l md:border-t-0' : ''}`}
                >
                  <div className="mb-12 flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-md border border-border">
                      <Icon className="size-4" />
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-3 min-h-16 text-sm leading-6 text-muted-foreground">
                    {step.body}
                  </p>
                  <code className="mt-6 block overflow-x-auto border-t border-border py-3 text-xs text-foreground">
                    <span className="text-muted-foreground">$ </span>
                    {step.command}
                  </code>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="features"
        className="scroll-mt-20 border-y border-border bg-white px-5 py-20 sm:px-8 sm:py-28"
      >
        <div className="mx-auto max-w-[1120px]">
          <SectionHeading
            title="Useful context. Zero data exhaust."
            body="A small Unix-style utility with enough context to be specific and enough restraint to stay truthful."
          />
          <div className="mt-12 grid border-y border-border sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="border-b border-border p-7 sm:border-r sm:p-8 lg:[&:nth-child(3n)]:border-r-0"
                >
                  <span className="mb-8 grid size-10 place-items-center rounded-md border border-border">
                    <Icon className="size-4" />
                  </span>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {feature.body}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-[1120px] items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <h2 className="text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              No black box.
              <br />
              Just strong signals.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
              GitHint combines multiple weak clues into one ranked suggestion.
              When confidence is low, it chooses a broad truth over a specific
              guess.
            </p>
            <ul className="mt-7 space-y-3 text-sm">
              {[
                'File and directory semantics',
                'Added code identifiers',
                'Diff patterns and Git statuses',
                'Branch and repository style hints',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <Check className="size-4 text-foreground" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-white text-xs text-muted-foreground shadow-[0_20px_60px_rgba(31,35,40,0.08)]">
            <div className="flex h-11 items-center gap-2 border-b border-border px-4">
              <FileDiff className="size-4" />
              <span>staged.diff</span>
              <span className="ml-auto text-[10px]">analyzed locally</span>
            </div>
            <div className="grid sm:grid-cols-[1fr_170px]">
              <pre className="overflow-x-auto p-5 font-mono leading-6 sm:p-6">
                <code>
                  <span className="text-muted-foreground">
                    @@ src/auth/session.ts
                  </span>
                  {'\n'}
                  <span className="text-foreground">- return session.user</span>
                  {'\n'}
                  <span className="font-semibold text-foreground">
                    + if (!session?.user) return null
                  </span>
                  {'\n'}
                  <span className="font-semibold text-foreground">
                    + return session.user
                  </span>
                  {'\n\n'}
                  <span className="text-muted-foreground">signals</span>
                  {'\n'}
                  <span className="text-foreground">scope</span> auth{`\n`}
                  <span className="text-foreground">identifier</span> session
                  user{`\n`}
                  <span className="text-foreground">pattern</span> null guard
                </code>
              </pre>
              <div className="border-t border-border p-5 sm:border-l sm:border-t-0">
                <p className="font-semibold text-foreground">Type scores</p>
                <Score label="fix" value="88" width="88%" />
                <Score label="feat" value="31" width="31%" />
                <Score label="refactor" value="24" width="24%" />
                <p className="mt-6 border-t border-border pt-4 text-[11px] leading-5">
                  Result
                  <br />
                  <span className="font-semibold text-foreground">
                    fix(auth): handle missing session user
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-[1120px] gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <h2 className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              The short version.
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Everything GitHint reads stays local. Everything it does is
              explicit.
            </p>
          </div>
          <div className="divide-y divide-border border-y border-border">
            {faq.map((item, index) => (
              <details
                key={item.question}
                className="group py-5"
                open={index === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-semibold">
                  <span>{item.question}</span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <p className="max-w-2xl pt-3 text-sm leading-6 text-muted-foreground">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-white px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5 font-semibold">
            <span className="grid size-8 place-items-center rounded-full border border-border text-foreground">
              <GitBranch className="size-4" />
            </span>
            GitHint
          </div>
          <p className="text-xs text-muted-foreground">
            Your diff already knows what changed. GitHint turns it into the
            commit hint.
          </p>
          <div className="flex gap-5 text-xs font-medium">
            <a
              href="https://github.com/zakisheriff/GitHint"
              className="hover:underline"
            >
              GitHub
            </a>
            <a
              href="https://github.com/zakisheriff/GitHint/blob/main/LICENSE"
              className="hover:underline"
            >
              MIT License
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function SectionHeading({ title, body }: { title: string; body: string }) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-muted-foreground">{body}</p>
    </div>
  );
}

function Score({
  label,
  value,
  width,
}: {
  label: string;
  value: string;
  width: string;
}) {
  return (
    <div className="mt-4">
      <div className="mb-1.5 flex justify-between">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-1 overflow-hidden border-t border-border">
        <span className="block border-t border-foreground" style={{ width }} />
      </div>
    </div>
  );
}
