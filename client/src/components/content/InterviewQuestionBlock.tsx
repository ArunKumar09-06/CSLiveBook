import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ChevronDown, Sparkles, Award } from 'lucide-react';
import { Button } from '../ui/Button';

export interface FollowUpItem {
  question: string;
  answer: string;
}

export interface InterviewQuestionBlockData {
  type: 'interview_question';
  id?: string;
  question: string;
  context?: string;
  modelAnswer: string;
  followUps?: FollowUpItem[];
}

export const InterviewQuestionBlock: React.FC<{ block: InterviewQuestionBlockData }> = ({
  block,
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [openFollowUp, setOpenFollowUp] = useState<number | null>(null);

  return (
    <div
      id={block.id}
      className="my-8 rounded-2xl glass-panel p-6 border border-pink-500/20 bg-pink-950/10 space-y-4"
    >
      <div className="flex items-center gap-2 text-xs font-mono text-pink-400 uppercase tracking-wider">
        <MessageSquare className="w-4 h-4" />
        <span>High-Frequency Interview Question</span>
      </div>

      <h4 className="font-display font-bold text-base sm:text-lg text-white">
        &ldquo;{block.question}&rdquo;
      </h4>

      {block.context && (
        <p className="text-xs text-[#A9B1D6] italic">
          Context: {block.context}
        </p>
      )}

      {/* Reveal Action Button */}
      <div className="pt-1">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowAnswer(!showAnswer)}
          icon={<Sparkles className="w-3.5 h-3.5 text-pink-400" />}
        >
          {showAnswer ? 'Hide Model Answer' : 'Reveal Model Answer'}
        </Button>
      </div>

      {/* Model Answer Drawer */}
      <AnimatePresence>
        {showAnswer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 pt-2 overflow-hidden"
          >
            <div className="p-4 rounded-xl bg-white/5 border border-surface-border text-xs sm:text-sm text-[#F5F7FF] leading-relaxed">
              <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 font-semibold mb-2">
                <Award className="w-4 h-4" />
                <span>Senior Staff Model Answer</span>
              </div>
              <div className="text-[#A9B1D6] leading-relaxed whitespace-pre-line">
                {block.modelAnswer}
              </div>
            </div>

            {/* Follow-up Chains */}
            {block.followUps && block.followUps.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono text-purple-300 uppercase tracking-wider block">
                  Interviewer Follow-Up Drill Chains:
                </span>
                {(block.followUps || []).map((fu, idx) => {
                  const isOpen = openFollowUp === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-surface-border glass-panel overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFollowUp(isOpen ? null : idx)}
                        className="w-full p-3 flex items-center justify-between text-left text-xs font-semibold text-white hover:bg-white/5 cursor-pointer"
                      >
                        <span>Follow-up {idx + 1}: {fu.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#6B7399] transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-3 pb-3 text-xs text-[#A9B1D6] border-t border-surface-border/50 pt-2 leading-relaxed">
                          {fu.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
