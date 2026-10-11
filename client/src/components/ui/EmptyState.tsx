import React from 'react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'glass-panel rounded-2xl p-10 flex flex-col items-center justify-center text-center max-w-md mx-auto border border-surface-border',
        className
      )}
    >
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center text-purple-300 mb-5 shadow-lg shadow-purple-950/20">
          {icon}
        </div>
      )}
      <h3 className="font-display text-lg font-bold text-white mb-2 tracking-tight">
        {title}
      </h3>
      <p className="text-sm text-[#A9B1D6] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
