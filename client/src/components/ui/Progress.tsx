import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';

export interface LinearProgressProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showLabel?: boolean;
  gradient?: string;
  colorTheme?: string;
  className?: string;
}

export const LinearProgress: React.FC<LinearProgressProps> = ({
  value,
  max = 100,
  label,
  showLabel = true,
  gradient,
  colorTheme,
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const themeGradients: Record<string, string> = {
    purple: 'from-purple-600 via-indigo-500 to-cyan-400',
    cyan: 'from-cyan-500 to-blue-500',
    rose: 'from-orange-500 to-rose-500',
    emerald: 'from-emerald-500 to-teal-500',
    amber: 'from-amber-500 to-orange-500',
  };

  const activeGradient = gradient || (colorTheme ? themeGradients[colorTheme] : themeGradients.purple);

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center text-xs font-mono text-[#A9B1D6] mb-1.5">
          <span>{label || 'Progress'}</span>
          <span className="font-semibold text-white">{percentage}%</span>
        </div>
      )}
      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden p-0.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={cn('h-full rounded-full bg-gradient-to-r shadow-sm', activeGradient)}
        />
      </div>
    </div>
  );
};

export interface ProgressRingProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  gradientColors?: { start: string; end: string };
  colorTheme?: 'purple' | 'cyan' | 'emerald' | 'amber' | 'rose';
  showText?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 80,
  strokeWidth = 7,
  gradientColors,
  colorTheme = 'purple',
  showText = true,
  children,
  className,
}) => {
  const themeColors = {
    purple: { start: '#8B5CF6', end: '#22D3EE' },
    cyan: { start: '#22D3EE', end: '#3B82F6' },
    emerald: { start: '#34D399', end: '#14B8A6' },
    amber: { start: '#FBBF24', end: '#F97316' },
    rose: { start: '#FB923C', end: '#F43F5E' },
  };

  const colors = gradientColors || themeColors[colorTheme] || themeColors.purple;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min(100, Math.max(0, value));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const gradientId = `ring-grad-${colors.start.replace('#', '')}-${colors.end.replace('#', '')}`;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.start} />
            <stop offset="100%" stopColor={colors.end} />
          </linearGradient>
        </defs>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/10"
          fill="transparent"
        />
        {/* Animated fill stroke */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      {children ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {children}
        </div>
      ) : showText ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-display font-bold text-sm tracking-tight text-white">
            {percentage}%
          </span>
        </div>
      ) : null}
    </div>
  );
};

export interface StepItem {
  id: string;
  title: string;
  status: 'completed' | 'current' | 'upcoming';
}

export const StepsProgress: React.FC<{ steps: StepItem[]; className?: string }> = ({
  steps,
  className,
}) => {
  return (
    <div className={cn('flex items-center w-full', className)}>
      {steps.map((step, idx) => {
        const isCompleted = step.status === 'completed';
        const isCurrent = step.status === 'current';

        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-semibold border transition-colors',
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : isCurrent
                    ? 'bg-purple-600/30 text-purple-200 border-purple-400/50 ring-4 ring-purple-600/10'
                    : 'bg-white/5 text-[#6B7399] border-white/10'
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <span
                className={cn(
                  'text-xs hidden sm:inline font-medium',
                  isCurrent ? 'text-white' : 'text-[#6B7399]'
                )}
              >
                {step.title}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-3 rounded',
                  isCompleted ? 'bg-emerald-500/50' : 'bg-white/10'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
