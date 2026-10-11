import React from 'react';
import { cn } from '../../lib/utils';

export interface ComparisonBlockData {
  type: 'comparison';
  id?: string;
  leftTitle: string;
  leftPoints: string[];
  rightTitle: string;
  rightPoints: string[];
  leftTheme?: string;
  rightTheme?: string;
}

export const ComparisonBlock: React.FC<{ block: ComparisonBlockData }> = ({ block }) => {
  return (
    <div id={block.id} className="relative my-8">
      {/* Side-by-side cards with VS badge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {/* Left Card */}
        <div className="rounded-2xl glass-panel p-6 border border-cyan-500/20 bg-cyan-950/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
            <h4 className="font-display font-bold text-base text-cyan-300">
              {block.leftTitle}
            </h4>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Paradigm A
            </span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-[#A9B1D6]">
            {block.leftPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Center VS Flourish */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-bg-0 border border-purple-500/40 items-center justify-center font-display font-bold text-xs text-purple-300 shadow-xl shadow-purple-950/60 pointer-events-none">
          VS
        </div>

        {/* Right Card */}
        <div className="rounded-2xl glass-panel p-6 border border-purple-500/20 bg-purple-950/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
            <h4 className="font-display font-bold text-base text-purple-300">
              {block.rightTitle}
            </h4>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Paradigm B
            </span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-[#A9B1D6]">
            {block.rightPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
