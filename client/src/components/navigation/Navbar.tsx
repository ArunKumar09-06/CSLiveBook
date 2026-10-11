import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Command as CommandIcon, Flame, User, LogOut } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Avatar } from '../ui/Avatar';
import { CommandPalette } from './CommandPalette';
import { useAuthStore } from '../../stores/authStore';
import { cn } from '../../lib/utils';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [paletteOpen, setPaletteOpen] = useState(false);

  const navLinks = [
    { label: 'Curriculum', path: '/subjects' },
    { label: 'Dashboard', path: '/dashboard' },
    ...(user?.role === 'ADMIN' ? [{ label: 'Admin Console', path: '/admin' }] : []),
    { label: 'Design System', path: '/design' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-surface-border bg-bg-1/75 backdrop-blur-xl transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center font-display font-bold text-base text-white shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform duration-200">
                CSF
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-white group-hover:text-purple-200 transition-colors">
                CSF <span className="aurora-text">Livebook</span>
              </span>
            </Link>

            {/* Nav links (desktop) */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      'px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                      isActive
                        ? 'text-white bg-white/10'
                        : 'text-[#A9B1D6] hover:text-white hover:bg-white/5'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Command Palette Trigger */}
            <button
              onClick={() => setPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl glass-panel border border-surface-border text-xs text-[#A9B1D6] hover:text-white hover:bg-white/10 transition-colors cursor-pointer select-none"
            >
              <CommandIcon className="w-3.5 h-3.5 text-purple-400" />
              <span>Search...</span>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-[#6B7399]">
                ⌘K
              </kbd>
            </button>

            {/* Streak Flame Badge */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-orange-500/10 to-rose-500/10 border border-orange-500/20 text-orange-400 font-mono text-xs font-semibold shadow-inner select-none">
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400 animate-pulse" />
              <span>{user?.streak?.current || 3}d</span>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth / Profile */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-surface-border">
                <Link to="/profile">
                  <Avatar name={user.name} size="sm" status="online" />
                </Link>
                <button
                  onClick={() => logout()}
                  title="Sign out"
                  className="p-1.5 rounded-lg text-[#6B7399] hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-surface-border">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white cta-button cursor-pointer"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Command Palette Modal */}
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  );
};
