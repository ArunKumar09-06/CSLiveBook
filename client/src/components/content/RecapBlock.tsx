import React from 'react';
import { Sparkles } from 'lucide-react';

export interface RecapBlockData {
  type: 'recap';
  id?: string;
  title?: string;
  items: string[];
}

export const RecapBlock: React.FC<{ block: RecapBlockData }> = ({ block }) => {
  return (
    <div
      id={block.id}
      className="my-10 rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/30 bg-gradient-to-br from-purple-950/20 via-bg-1 to-bg-0 space-y-6"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-display font-bold text-lg text-white">
            {block.title || 'If You Remember Only 5 Things'}
          </h4>
          <span className="text-[11px] font-mono text-[#A9B1D6]">
            High-Yield Executive Summary &bull; Memorize for Technical Screens
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {block.items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/5 border border-surface-border text-xs sm:text-sm text-[#F5F7FF] leading-relaxed"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 text-white font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-md">
              {idx + 1}
            </div>
            <div className="flex-1 pt-0.5">{item}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
