import React from 'react';
import { GlassCard } from './Card';
import { cn } from '../../lib/utils';

interface StatTileProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  accentColor?: 'purple' | 'cyan' | 'emerald' | 'amber' | 'rose';
  className?: string;
}

export const StatTile: React.FC<StatTileProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = 'purple',
  className,
}) => {
  const accentGlow = {
    purple: 'from-purple-500/20 to-indigo-500/0 text-purple-400',
    cyan: 'from-cyan-500/20 to-blue-500/0 text-cyan-400',
    emerald: 'from-emerald-500/20 to-teal-500/0 text-emerald-400',
    amber: 'from-amber-500/20 to-orange-500/0 text-amber-400',
    rose: 'from-rose-500/20 to-pink-500/0 text-rose-400',
  };

  return (
    <GlassCard className={cn('relative overflow-hidden p-5 group', className)}>
      <div
        className={cn(
          'absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl rounded-bl-full pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity duration-300',
          accentGlow[accentColor]
        )}
      />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#6B7399]">
            {title}
          </span>
          <div className="font-display text-3xl font-bold tracking-tight text-white mt-1">
            {value}
          </div>
          {subtitle && (
            <div className="text-xs text-[#A9B1D6] mt-1.5">{subtitle}</div>
          )}
          {trend && (
            <div className="inline-flex items-center gap-1 text-xs font-medium mt-2">
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded font-mono',
                  trend.isPositive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                )}
              >
                {trend.value}
              </span>
              <span className="text-[#6B7399] text-[11px]">vs last week</span>
            </div>
          )}
        </div>

        {icon && (
          <div
            className={cn(
              'p-2.5 rounded-xl bg-white/5 border border-surface-border text-white shadow-inner flex items-center justify-center',
              accentGlow[accentColor].split(' ').pop()
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </GlassCard>
  );
};
