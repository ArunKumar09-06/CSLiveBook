import React from 'react';
import { cn } from '../../lib/utils';

export interface ComparisonCriterion {
  name: string;
  left: string;
  right: string;
}

export interface ComparisonBlockData {
  type: 'comparison';
  id?: string;
  title?: string;
  leftTitle?: string;
  rightTitle?: string;
  leftPoints?: string[];
  rightPoints?: string[];
  leftItems?: string[];
  rightItems?: string[];
  criteria?: ComparisonCriterion[];
  leftTheme?: string;
  rightTheme?: string;
}

export const ComparisonBlock: React.FC<{ block: ComparisonBlockData }> = ({ block }) => {
  const leftTitle = block.leftTitle || 'Approach A';
  const rightTitle = block.rightTitle || 'Approach B';
  const criteria = block.criteria || [];

  const leftPoints =
    block.leftPoints ||
    block.leftItems ||
    (criteria.length > 0 ? criteria.map((c) => `${c.name}: ${c.left}`) : []);

  const rightPoints =
    block.rightPoints ||
    block.rightItems ||
    (criteria.length > 0 ? criteria.map((c) => `${c.name}: ${c.right}`) : []);

  // If structured criteria table is present, render matrix view
  if (criteria.length > 0) {
    return (
      <div id={block.id} className="my-8 rounded-2xl glass-panel border border-surface-border overflow-hidden space-y-3">
        {block.title && (
          <div className="px-5 py-3.5 bg-white/5 border-b border-surface-border flex items-center justify-between">
            <h4 className="font-display font-bold text-sm text-white">{block.title}</h4>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
              Architectural Matrix
            </span>
          </div>
        )}

        <div className="overflow-x-auto p-2">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="text-xs font-mono uppercase tracking-wider border-b border-surface-border/60">
              <tr>
                <th className="px-4 py-2.5 text-[#6B7399]">Dimension</th>
                <th className="px-4 py-2.5 text-cyan-300 font-semibold">{leftTitle}</th>
                <th className="px-4 py-2.5 text-purple-300 font-semibold">{rightTitle}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/40 text-[#F5F7FF]">
              {criteria.map((c, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium text-xs text-[#A9B1D6]">
                    {c.name}
                  </td>
                  <td className="px-4 py-3 text-cyan-100/90 leading-relaxed text-xs">
                    {c.left}
                  </td>
                  <td className="px-4 py-3 text-purple-100/90 leading-relaxed text-xs">
                    {c.right}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Side-by-side cards view
  return (
    <div id={block.id} className="relative my-8">
      {block.title && (
        <h4 className="font-display font-bold text-base text-white mb-4">{block.title}</h4>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {/* Left Card */}
        <div className="rounded-2xl glass-panel p-6 border border-cyan-500/20 bg-cyan-950/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
            <h4 className="font-display font-bold text-base text-cyan-300">
              {leftTitle}
            </h4>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Paradigm A
            </span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-[#A9B1D6]">
            {leftPoints.map((point, idx) => (
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
              {rightTitle}
            </h4>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Paradigm B
            </span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-[#A9B1D6]">
            {rightPoints.map((point, idx) => (
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
