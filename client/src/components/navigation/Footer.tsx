import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Terminal, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 w-full border-t border-surface-border bg-bg-1/60 backdrop-blur-md transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center font-display font-bold text-sm text-white shadow-md shadow-purple-500/20">
                CSF
              </div>
              <span className="font-display font-bold text-base tracking-tight text-white">
                CSF <span className="aurora-text">Livebook</span>
              </span>
            </div>
            <p className="text-xs text-[#A9B1D6] leading-relaxed">
              The CS Fundamentals Interview Master Curriculum. 8 Subjects, 42 Modules, and 184 High-Priority Concepts.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#6B7399]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Production-Grade Architecture</span>
            </div>
          </div>

          {/* Subjects Col 1 */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-purple-300 mb-3">
              Core Subjects
            </h4>
            <ul className="space-y-2 text-xs text-[#A9B1D6]">
              <li>
                <Link to="/subjects/dbms-sql" className="hover:text-cyan-400 transition-colors">
                  DBMS & SQL (38 Concepts)
                </Link>
              </li>
              <li>
                <Link to="/subjects/oops" className="hover:text-purple-400 transition-colors">
                  Object-Oriented Programming (24)
                </Link>
              </li>
              <li>
                <Link to="/subjects/os" className="hover:text-orange-400 transition-colors">
                  Operating Systems (40 Concepts)
                </Link>
              </li>
              <li>
                <Link to="/subjects/cn" className="hover:text-emerald-400 transition-colors">
                  Computer Networks (25 Concepts)
                </Link>
              </li>
            </ul>
          </div>

          {/* Subjects Col 2 */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-300 mb-3">
              Systems & Delivery
            </h4>
            <ul className="space-y-2 text-xs text-[#A9B1D6]">
              <li>
                <Link to="/subjects/devops" className="hover:text-amber-400 transition-colors">
                  DevOps & Delivery (23 Concepts)
                </Link>
              </li>
              <li>
                <Link to="/subjects/ca" className="hover:text-sky-400 transition-colors">
                  Computer Architecture (2 Concepts)
                </Link>
              </li>
              <li>
                <Link to="/subjects/system-design" className="hover:text-indigo-400 transition-colors">
                  System Design Fundamentals (9)
                </Link>
              </li>
              <li>
                <Link to="/subjects/genai" className="hover:text-pink-400 transition-colors">
                  GenAI & AI Fundamentals (23)
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform / Developer */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#F5F7FF] mb-3">
              Platform & Tools
            </h4>
            <ul className="space-y-2 text-xs text-[#A9B1D6]">
              <li>
                <Link to="/design" className="hover:text-purple-300 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Design System Showcase</span>
                </Link>
              </li>
              <li>
                <a
                  href="http://localhost:4000/health"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>API Health Check</span>
                </a>
              </li>
              <li>
                <span className="text-[#6B7399]">MERN + TypeScript Strict</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-surface-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#6B7399]">
          <div>
            CSF Livebook &copy; {new Date().getFullYear()} &bull; Built for High-Priority CS Interviews
          </div>
          <div className="flex items-center gap-4">
            <span className="text-purple-400/80">Phase 4 Design System Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
