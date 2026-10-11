import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'text-xs py-1.5 px-3',
    md: 'text-sm py-2 px-4',
    lg: 'text-base py-2.5 px-5',
  };

  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center p-1 rounded-xl glass-panel relative bg-bg-1/80 border border-surface-border',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative z-10 font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 cursor-pointer select-none',
              sizeClasses[size],
              isActive ? 'text-white' : 'text-[#A9B1D6] hover:text-white'
            )}
          >
            {tab.icon && <span className="text-current">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded-full font-mono font-semibold',
                  isActive
                    ? 'bg-purple-500/30 text-purple-200 border border-purple-400/40'
                    : 'bg-white/10 text-[#6B7399]'
                )}
              >
                {tab.count}
              </span>
            )}
            {isActive && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute inset-0 bg-gradient-to-r from-purple-600/70 to-indigo-600/70 rounded-lg -z-10 shadow-lg shadow-purple-900/30 border border-purple-400/30"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
