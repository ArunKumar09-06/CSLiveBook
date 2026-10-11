import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils.js';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'cta' | 'primary' | 'secondary' | 'ghost' | 'glow' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      children,
      icon,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'relative inline-flex items-center justify-center font-medium select-none transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-purple-400 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none';

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
      md: 'text-sm px-4 py-2 rounded-xl gap-2',
      lg: 'text-base px-6 py-3 rounded-2xl gap-2.5 font-semibold',
    }[size];

    const variantStyles = {
      cta: 'cta-button text-white font-semibold shadow-lg shadow-purple-600/30 overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-700',
      primary:
        'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/20 hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-600/40 border border-purple-500/30',
      secondary:
        'glass-panel text-[#F5F7FF] hover:bg-white/10 hover:border-white/25 active:bg-white/5',
      ghost: 'text-[#A9B1D6] hover:text-white hover:bg-white/5 active:bg-white/10',
      glow: 'bg-bg-1/80 text-white border border-cyan-500/40 shadow-[0_0_20px_-3px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_-2px_rgba(6,182,212,0.6)] hover:border-cyan-400',
      danger:
        'bg-rose-600/80 hover:bg-rose-600 text-white border border-rose-500/30 shadow-md shadow-rose-600/20',
    }[variant];

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.015 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
        disabled={disabled || loading}
        className={cn(baseStyles, sizeStyles, variantStyles, className)}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {!loading && icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
