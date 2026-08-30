'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';

const command = 'npm install -g githint';

export function InstallCommand() {
  const [copied, setCopied] = useState(false);

  async function copyCommand() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="mx-auto flex max-w-xl items-center gap-3 rounded-lg border border-border bg-white p-2 pl-4 text-left">
      <span className="font-mono text-sm text-muted-foreground">$</span>
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm text-foreground">
        {command}
      </code>
      <Button
        variant="outline"
        onClick={copyCommand}
        aria-label="Copy installation command"
        className="h-9 border border-border bg-white px-3 text-foreground hover:border-foreground hover:bg-white"
      >
        {copied ? 'Copied' : 'Copy'}
      </Button>
    </div>
  );
}
