import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface UnderstandingCheckOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface UnderstandingCheckBlockData {
  type: 'understanding_check';
  id?: string;
  question: string;
  options: UnderstandingCheckOption[];
}

export const UnderstandingCheckBlock: React.FC<{ block: UnderstandingCheckBlockData }> = ({
  block,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedOption = block.options.find((o) => o.id === selectedId);

  return (
    <div
      id={block.id}
      className="my-8 rounded-2xl glass-panel p-6 border border-purple-500/20 bg-purple-950/10 space-y-4"
    >
      <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-wider">
        <HelpCircle className="w-4 h-4" />
        <span>Quick Understanding Check</span>
      </div>

      <h4 className="font-display font-semibold text-base text-white">
        {block.question}
      </h4>

      {/* Options */}
      <div className="space-y-2 pt-1">
        {block.options.map((opt) => {
          const isSelected = selectedId === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedId(opt.id)}
              className={cn(
                'w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer',
                isSelected
                  ? opt.isCorrect
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-500/15 border-rose-500/40 text-rose-200'
                  : 'glass-panel bg-white/5 border-surface-border text-[#A9B1D6] hover:bg-white/10 hover:text-white'
              )}
            >
              <span>{opt.text}</span>
              {isSelected && (
                <span>
                  {opt.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback Panel */}
      <AnimatePresence>
        {selectedOption && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={cn(
              'p-3.5 rounded-xl border text-xs leading-relaxed mt-2',
              selectedOption.isCorrect
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            )}
          >
            <strong>{selectedOption.isCorrect ? 'Correct!' : 'Incorrect.'}</strong>{' '}
            {selectedOption.explanation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
