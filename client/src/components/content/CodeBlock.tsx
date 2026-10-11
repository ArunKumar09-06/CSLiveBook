import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

export interface CodeBlockData {
  type: 'code';
  id?: string;
  language: string;
  code: string;
  caption?: string;
  highlightLines?: number[];
}

export const CodeBlock: React.FC<{ block: CodeBlockData }> = ({ block }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(block.code);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy code');
    }
  };

  const lines = block.code.split('\n');

  return (
    <div id={block.id} className="rounded-2xl glass-panel bg-bg-2 border border-surface-border overflow-hidden my-6">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500/80" />
          <span className="text-[11px] font-mono text-[#A9B1D6] uppercase tracking-wider">
            {block.language || 'text'}
          </span>
          {block.caption && (
            <span className="text-[11px] text-[#6B7399] ml-2 hidden sm:inline">
              &mdash; {block.caption}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono text-[#A9B1D6] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body with Line Numbers */}
      <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed bg-[#05060F]/60">
        <pre className="table w-full">
          <tbody>
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const isHighlighted = block.highlightLines?.includes(lineNum);
              return (
                <tr
                  key={idx}
                  className={cn(
                    'transition-colors',
                    isHighlighted ? 'bg-purple-600/15 border-l-2 border-purple-400' : ''
                  )}
                >
                  <td className="table-cell select-none pr-4 text-[#6B7399] text-right w-8 text-[11px]">
                    {lineNum}
                  </td>
                  <td className="table-cell text-[#F5F7FF] whitespace-pre font-mono">
                    {line}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </pre>
      </div>
    </div>
  );
};
