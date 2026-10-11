import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { cn } from '../../lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={cn(
        'relative p-2 rounded-xl glass-panel border border-surface-border text-[#A9B1D6] hover:text-white hover:bg-white/10 transition-colors cursor-pointer select-none overflow-hidden',
        className
      )}
    >
      <motion.div
        key={theme}
        initial={{ y: -15, opacity: 0, rotate: -45 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        exit={{ y: 15, opacity: 0, rotate: 45 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Moon className="w-5 h-5 text-purple-300" />
        ) : (
          <Sun className="w-5 h-5 text-amber-400" />
        )}
      </motion.div>
    </button>
  );
};
