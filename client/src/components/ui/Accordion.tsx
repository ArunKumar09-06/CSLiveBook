import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface AccordionItemData {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItemData[];
  allowMultiple?: boolean;
  defaultExpanded?: string[];
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultExpanded = [],
  className,
}) => {
  const [expandedIds, setExpandedIds] = useState<string[]>(defaultExpanded);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setExpandedIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setExpandedIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={cn('space-y-3 w-full', className)}>
      {items.map((item) => {
        const isExpanded = expandedIds.includes(item.id);
        return (
          <div
            key={item.id}
            className="rounded-xl glass-panel border border-surface-border overflow-hidden transition-colors"
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isExpanded}
              className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left font-display font-medium text-[#F5F7FF] hover:bg-white/5 transition-colors cursor-pointer select-none"
            >
              <div className="flex items-center gap-3">
                {item.icon && <span className="text-purple-400">{item.icon}</span>}
                <span>{item.title}</span>
              </div>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="text-[#6B7399]"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 pt-1 text-sm text-[#A9B1D6] leading-relaxed border-t border-surface-border/50">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
