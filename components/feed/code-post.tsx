'use client';

import { useState } from 'react';
import { Copy, Check, Code2, Terminal } from 'lucide-react';
import { toast } from 'sonner';

interface CodePostProps {
  code: string;
  language?: string;
  title?: string;
}

export default function CodePost({ code, language = 'typescript', title }: CodePostProps) {
  const [copied, setCopied] = useState(false);

  const lines = code.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-xl overflow-hidden border border-border/80 shadow-xs bg-zinc-950 text-zinc-100">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <Code2 className="w-4 h-4 text-primary shrink-0" />
          {title ? (
            <span className="font-mono font-medium text-zinc-200 truncate">{title}</span>
          ) : (
            <span className="font-mono text-zinc-400 capitalize">{language}</span>
          )}
          {title && (
            <span className="px-1.5 py-0.5 rounded-sm bg-zinc-800 text-[10px] font-mono text-zinc-400 uppercase">
              {language}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
            {lines.length} {lines.length === 1 ? 'line' : 'lines'}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            title="Copy code"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Code Body with Line Numbers */}
      <div className="p-4 overflow-x-auto text-xs sm:text-[13px] font-mono leading-relaxed">
        <pre className="flex">
          {/* Line Numbers */}
          <span className="select-none text-zinc-400 text-right pr-4 border-r border-zinc-800/80 mr-4 shrink-0">
            {lines.map((_, i) => (
              <span key={i} className="block leading-relaxed">
                {i + 1}
              </span>
            ))}
          </span>

          {/* Actual Code Lines */}
          <code className="flex-1 text-zinc-100 whitespace-pre">
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}
