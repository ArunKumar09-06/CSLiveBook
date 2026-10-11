import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  LayoutDashboard,
  Palette,
  Sun,
  Moon,
  Database,
  Layers,
  Cpu,
  Globe,
  GitBranch,
  Server,
  Network,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';

interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open: controlledOpen,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isOpen, setIsOpen]);

  const runCommand = (command: () => void) => {
    setIsOpen(false);
    command();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* CMDK Container */}
      <div className="relative z-10 w-full max-w-xl glass-panel bg-bg-1/95 border border-surface-border rounded-2xl shadow-2xl shadow-purple-950/50 overflow-hidden text-[#F5F7FF]">
        <Command className="w-full">
          <div className="flex items-center px-4 border-b border-surface-border">
            <Search className="w-5 h-5 text-[#6B7399] mr-3" />
            <Command.Input
              placeholder="Search concepts, subjects, or actions... (⌘K)"
              className="w-full bg-transparent py-4 text-sm text-white placeholder-[#6B7399] focus:outline-none font-sans"
              autoFocus
            />
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2 space-y-1">
            <Command.Empty className="py-8 text-center text-sm text-[#A9B1D6]">
              No matching concepts or commands found.
            </Command.Empty>

            <Command.Group
              heading="Quick Navigation"
              className="text-[11px] font-mono uppercase tracking-wider text-[#6B7399] px-2 py-1"
            >
              <Command.Item
                onSelect={() => runCommand(() => navigate('/'))}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#F5F7FF] hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Home / Landing Page</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/dashboard'))}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#F5F7FF] hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-purple-400" />
                <span>Student Dashboard</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/design'))}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#F5F7FF] hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
              >
                <Palette className="w-4 h-4 text-pink-400" />
                <span>Design System Showcase</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/admin'))}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#F5F7FF] hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Admin Console & Authoring</span>
              </Command.Item>
            </Command.Group>

            <Command.Group
              heading="Subjects (Curriculum)"
              className="text-[11px] font-mono uppercase tracking-wider text-[#6B7399] px-2 py-1 mt-2"
            >
              <Command.Item
                onSelect={() => runCommand(() => navigate('/subjects/dbms-sql'))}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#F5F7FF] hover:bg-white/10 cursor-pointer"
              >
                <Database className="w-4 h-4 text-cyan-400" />
                <span>DBMS & SQL (38 concepts)</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/subjects/oops'))}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#F5F7FF] hover:bg-white/10 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Object-Oriented Programming (24 concepts)</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/subjects/os'))}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#F5F7FF] hover:bg-white/10 cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-orange-400" />
                <span>Operating Systems (40 concepts)</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/subjects/cn'))}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#F5F7FF] hover:bg-white/10 cursor-pointer"
              >
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Computer Networks (25 concepts)</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/subjects/devops'))}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#F5F7FF] hover:bg-white/10 cursor-pointer"
              >
                <GitBranch className="w-4 h-4 text-amber-400" />
                <span>DevOps & Software Delivery (23 concepts)</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/subjects/system-design'))}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#F5F7FF] hover:bg-white/10 cursor-pointer"
              >
                <Server className="w-4 h-4 text-indigo-400" />
                <span>System Design Fundamentals (9 concepts)</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/subjects/genai'))}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#F5F7FF] hover:bg-white/10 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>GenAI & AI Fundamentals (23 concepts)</span>
              </Command.Item>
            </Command.Group>

            <Command.Group
              heading="Actions"
              className="text-[11px] font-mono uppercase tracking-wider text-[#6B7399] px-2 py-1 mt-2"
            >
              <Command.Item
                onSelect={() => runCommand(toggleTheme)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#F5F7FF] hover:bg-white/10 cursor-pointer"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-purple-400" />
                )}
                <span>Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
              </Command.Item>
            </Command.Group>
          </Command.List>

          <div className="px-4 py-2.5 bg-black/30 border-t border-surface-border text-[11px] text-[#6B7399] flex items-center justify-between font-mono">
            <span>Navigation: ↑ ↓ Enter</span>
            <span>ESC to close</span>
          </div>
        </Command>
      </div>
    </div>
  );
};
