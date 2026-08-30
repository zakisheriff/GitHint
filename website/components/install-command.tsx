'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

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
    <div className="mx-auto mt-9 flex max-w-xl items-center gap-3 rounded-lg border border-[#30363d] bg-[#161b22] p-2 pl-4 text-left shadow-2xl">
      <span className="font-mono text-sm text-[#6e7681]">$</span>
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm text-[#e6edf3]">
        {command}
      </code>
      <Button
        onClick={copyCommand}
        aria-label="Copy installation command"
        className="h-9 bg-[#238636] px-3 text-white hover:bg-[#2ea043]"
      >
        {copied ? (
          <>
            <Check className="size-4" /> Copied
          </>
        ) : (
          <>
            <Copy className="size-4" /> Copy
          </>
        )}
      </Button>
    </div>
  );
}
