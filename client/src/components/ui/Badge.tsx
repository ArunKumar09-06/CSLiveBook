import React from 'react';
import { cn } from '../../lib/utils.js';
import { CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { SUBJECT_THEMES } from '../../lib/constants.js';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const styles = {
    default: 'bg-white/10 text-white border-white/15',
    outline: 'bg-transparent text-[#A9B1D6] border-white/20',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    info: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  }[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border font-mono tracking-tight',
        styles,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export const DifficultyBadge: React.FC<{ difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' }> = ({
  difficulty,
}) => {
  const config = {
    BEGINNER: { label: 'Beginner', variant: 'success' as const },
    INTERMEDIATE: { label: 'Intermediate', variant: 'warning' as const },
    ADVANCED: { label: 'Advanced', variant: 'danger' as const },
  }[difficulty] || { label: difficulty, variant: 'default' as const };

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export const StatusBadge: React.FC<{ status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' }> = ({
  status,
}) => {
  if (status === 'COMPLETED') {
    return (
      <Badge variant="success" className="gap-1">
        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
        Completed
      </Badge>
    );
  }

  if (status === 'IN_PROGRESS') {
    return (
      <Badge variant="info" className="gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        In Progress
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1">
      <Clock className="w-3 h-3 text-[#A9B1D6]" />
      Not Started
    </Badge>
  );
};

export const SubjectBadge: React.FC<{ themeKey: string; name?: string }> = ({
  themeKey,
  name,
}) => {
  const theme = SUBJECT_THEMES[themeKey] || SUBJECT_THEMES.dbms;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
      style={{
        backgroundColor: `${theme.from}15`,
        borderColor: `${theme.from}35`,
        color: theme.from,
      }}
    >
      <Sparkles className="w-3 h-3" />
      {name || theme.name}
    </span>
  );
};
