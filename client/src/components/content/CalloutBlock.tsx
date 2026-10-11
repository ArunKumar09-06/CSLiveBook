import React from 'react';
import { Info, Lightbulb, AlertTriangle, ShieldAlert, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CalloutBlockData {
  type: 'callout';
  id?: string;
  variant: 'info' | 'tip' | 'warning' | 'danger' | 'note';
  title?: string;
  text: string;
}

export const CalloutBlock: React.FC<{ block: CalloutBlockData }> = ({ block }) => {
  const configs = {
    info: {
      icon: <Info className="w-5 h-5 text-cyan-400" />,
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-500/10',
      titleColor: 'text-cyan-300',
    },
    tip: {
      icon: <Lightbulb className="w-5 h-5 text-emerald-400" />,
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
      titleColor: 'text-emerald-300',
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
      titleColor: 'text-amber-300',
    },
    danger: {
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
      border: 'border-rose-500/30',
      bg: 'bg-rose-500/10',
      titleColor: 'text-rose-300',
    },
    note: {
      icon: <FileText className="w-5 h-5 text-purple-400" />,
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/10',
      titleColor: 'text-purple-300',
    },
  };

  const config = configs[block.variant] || configs.info;

  return (
    <div
      id={block.id}
      className={cn(
        'rounded-2xl p-4 sm:p-5 border transition-all my-6 flex items-start gap-3.5',
        config.border,
        config.bg
      )}
    >
      <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
      <div className="space-y-1 text-sm text-[#F5F7FF] leading-relaxed">
        {block.title && (
          <h4 className={cn('font-display font-semibold text-sm', config.titleColor)}>
            {block.title}
          </h4>
        )}
        <div className="text-xs sm:text-sm text-[#A9B1D6] leading-relaxed">
          {block.text}
        </div>
      </div>
    </div>
  );
};
