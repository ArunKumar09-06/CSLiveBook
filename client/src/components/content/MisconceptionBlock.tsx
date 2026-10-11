import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, XCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface MisconceptionBlockData {
  type: 'misconception';
  id?: string;
  myth: string;
  reality: string;
  explanation: string;
}

export const MisconceptionBlock: React.FC<{ block: MisconceptionBlockData }> = ({ block }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div id={block.id} className="my-8 cursor-pointer select-none" onClick={() => setIsFlipped(!isFlipped)}>
      <div className="relative rounded-2xl glass-panel p-6 border transition-all duration-300 hover:border-white/25 overflow-hidden">
        {/* Flip action badge */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-4">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold',
                isFlipped
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              )}
            >
              {isFlipped ? 'The Reality' : 'The Common Myth'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#A9B1D6] hover:text-white font-mono">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Click to flip</span>
          </div>
        </div>

        {/* Dynamic Card Content */}
        {!isFlipped ? (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-display font-bold text-base text-white">
                  &ldquo;{block.myth}&rdquo;
                </h4>
                <p className="text-xs text-[#A9B1D6] mt-2">
                  Many candidates incorrectly assume this during interviews. Click this card to reveal the engineering reality.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-display font-bold text-base text-emerald-300">
                  {block.reality}
                </h4>
                <p className="text-xs sm:text-sm text-[#A9B1D6] mt-2 leading-relaxed">
                  {block.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
