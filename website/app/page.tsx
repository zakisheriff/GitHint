import Image from 'next/image';

import { InstallCommand } from '@/components/install-command';

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

function Wordmark() {
  return (
    <span className="relative block h-12 w-32 overflow-hidden">
      <Image
        src="/githint-logo.png"
        alt="GitHint"
        width={128}
        height={128}
        className="absolute left-1/2 top-1/2 size-32 -translate-x-1/2 -translate-y-1/2 object-contain"
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

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1180px] items-center justify-between px-5 sm:px-8">
          <a href="#top" aria-label="GitHint home">
            <Wordmark />
          </a>
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/zakisheriff/GitHint"
              className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
            >
              GitHub
            </a>
            <a
              href="https://github.com/zakisheriff/GitHint/archive/refs/heads/main.zip"
              className="inline-flex h-10 items-center rounded-md bg-foreground px-4 text-sm font-semibold text-white hover:opacity-80"
              download
            >
              Download
            </a>
          </div>
        </div>
      </header>

      <section
        id="top"
        className="flex min-h-[calc(100svh-5rem)] items-center justify-center px-5 pb-16 sm:px-8"
      >
        <div className="mx-auto w-full max-w-[1060px] text-center">
          <h1 className="text-balance text-[clamp(3.25rem,9vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.07em]">
            Don&apos;t know what to write?
          </h1>
          <div className="mx-auto mt-12 max-w-xl">
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
    </main>
  );
}
