import { InstallCommand } from '@/components/install-command';
import Image from 'next/image';

const steps = [
  {
    number: '01',
    title: 'Stage your changes',
    body: 'Choose exactly what belongs in the commit.',
    command: 'git add .',
  },
  {
    number: '02',
    title: 'Run GitHint',
    body: 'GitHint reads the staged diff on your machine.',
    command: 'ghint',
  },
  {
    number: '03',
    title: 'Use the suggestion',
    body: 'Copy, edit, or commit the Conventional Commit.',
    command: 'feat: add mobile navigation',
  },
];

export const faq = [
  {
    question: 'What is GitHint?',
    answer:
      'GitHint is a free command-line tool that turns staged Git changes into clear Conventional Commit suggestions.',
  },
  {
    question: 'Does GitHint use AI?',
    answer:
      'No. GitHint uses deterministic local rules. Your code never leaves your computer, and no API key is required.',
  },
  {
    question: 'What does GitHint inspect?',
    answer:
      'It reads staged file names, paths, Git statuses, branch hints, diff patterns, and useful code identifiers.',
  },
  {
    question: 'Can it commit or push for me?',
    answer:
      'Yes, when you ask it to. Use --yes to commit without confirmation and --push to push to the existing upstream.',
  },
  {
    question: 'Which systems are supported?',
    answer:
      'GitHint works on macOS and Linux, and on Windows where Node.js 20 or newer and Git are available.',
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
  downloadUrl:
    'https://github.com/zakisheriff/GitHint/archive/refs/heads/main.zip',
  codeRepository: 'https://github.com/zakisheriff/GitHint',
  softwareVersion: '0.1.0',
  license: 'https://opensource.org/license/mit',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  author: {
    '@type': 'Person',
    name: 'Zaki Sheriff',
    url: 'https://github.com/zakisheriff',
  },
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

function Wordmark({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`relative block overflow-hidden ${small ? 'h-10 w-28' : 'h-12 w-32'}`}
    >
      <Image
        src="/githint-logo.png"
        alt="GitHint"
        width={128}
        height={128}
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-contain ${small ? 'size-28' : 'size-32'}`}
      />
    </span>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1180px] items-center justify-between px-5 sm:px-8">
          <a href="#top" aria-label="GitHint home">
            <Wordmark />
          </a>
          <nav
            className="hidden items-center gap-7 text-sm text-muted-foreground md:flex"
            aria-label="Main navigation"
          >
            <a href="#how-it-works" className="hover:text-foreground">
              How it works
            </a>
            <a href="#faq" className="hover:text-foreground">
              FAQ
            </a>
            <a
              href="https://github.com/zakisheriff/GitHint"
              className="hover:text-foreground"
            >
              GitHub
            </a>
          </nav>
          <a
            href="https://github.com/zakisheriff/GitHint/archive/refs/heads/main.zip"
            className="inline-flex h-10 items-center rounded-md bg-foreground px-4 text-sm font-semibold text-white hover:opacity-80"
            download
          >
            Download
          </a>
        </div>
      </header>

      <section
        id="top"
        className="scroll-mt-24 px-5 pb-24 pt-20 sm:px-8 sm:pb-32 sm:pt-28"
      >
        <div className="mx-auto max-w-[1060px] text-center">
          <h1 className="text-[clamp(4.5rem,16vw,11rem)] font-semibold leading-[0.8] tracking-[-0.08em]">
            Commits.
          </h1>
          <div className="mx-auto mt-14 max-w-xl">
            <InstallCommand />
            <a
              href="https://github.com/zakisheriff/GitHint/archive/refs/heads/main.zip"
              className="mt-4 inline-flex h-11 items-center rounded-md bg-foreground px-6 text-sm font-semibold text-white hover:opacity-80"
              download
            >
              Download GitHint
            </a>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28"
      >
        <div className="mx-auto max-w-[1060px]">
          <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
            How it works
          </h2>
          <div className="mt-16 grid gap-14 md:grid-cols-3 md:gap-12">
            {steps.map((step) => (
              <article key={step.number}>
                <p className="font-mono text-sm text-muted-foreground">
                  {step.number}
                </p>
                <h3 className="mt-7 text-2xl font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xs leading-7 text-muted-foreground">
                  {step.body}
                </p>
                <code className="mt-8 block overflow-x-auto whitespace-nowrap font-mono text-sm">
                  $ {step.command}
                </code>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-[1060px] items-start gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-24">
          <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Local by design.
          </h2>
          <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
            <div>
              <h3 className="font-semibold">No AI</h3>
              <p className="mt-2 leading-7 text-muted-foreground">
                Predictable suggestions from transparent rules.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">No uploads</h3>
              <p className="mt-2 leading-7 text-muted-foreground">
                Your staged diff stays on your machine.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">No account</h3>
              <p className="mt-2 leading-7 text-muted-foreground">
                Install the command and start immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">No waiting</h3>
              <p className="mt-2 leading-7 text-muted-foreground">
                Fast enough to remain part of your flow.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-[860px]">
          <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Questions
          </h2>
          <div className="mt-12">
            {faq.map((item) => (
              <details key={item.question} className="py-5">
                <summary className="cursor-pointer list-none text-lg font-semibold">
                  {item.question}
                </summary>
                <p className="max-w-2xl pt-4 leading-7 text-muted-foreground">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-5 py-12 sm:px-8">
        <div className="mx-auto flex max-w-[1060px] flex-col gap-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <a href="#top" aria-label="Back to the top">
            <Wordmark small />
          </a>
          <p>MIT licensed. Built by The Atom.</p>
        </div>
      </footer>
    </main>
  );
}
