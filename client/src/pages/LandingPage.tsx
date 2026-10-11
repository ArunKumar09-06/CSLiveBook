import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Database,
  Cpu,
  Layers,
  Globe,
  GitBranch,
  Server,
  Zap,
  CheckCircle2,
  Terminal,
  ShieldCheck,
} from 'lucide-react';
import { PageTransition } from '../components/layout/PageTransition';
import { Button } from '../components/ui/Button';
import { GlassCard, TiltCard, GradientBorderCard } from '../components/ui/Card';
import { SUBJECT_THEMES } from '../lib/constants';

export const LandingPage: React.FC = () => {
  return (
    <PageTransition className="relative flex-1 flex flex-col items-center overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 flex flex-col items-center text-center">
        {/* Subtle pill header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-xs text-purple-300 mb-8 border border-purple-500/30 shadow-lg shadow-purple-950/20"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>The Computer Science Fundamentals Interview Master Curriculum</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1] max-w-4xl"
        >
          Crack CS Fundamentals Interviews,{' '}
          <span className="aurora-text">Concept by Concept.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-[#A9B1D6] max-w-2xl mb-10 leading-relaxed font-sans"
        >
          8 subjects &bull; 42 modules &bull; 184 high-priority concepts. Built with structured content blocks, 3D interactive diagrams, one-page cheat sheets, and rigorous server-graded quizzes.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <Link to="/subjects">
            <Button variant="cta" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
              Start Learning Now
            </Button>
          </Link>
          <Link to="/design">
            <Button variant="secondary" size="lg" icon={<Sparkles className="w-5 h-5" />}>
              Explore Design System (/design)
            </Button>
          </Link>
        </motion.div>

        {/* Core Stats Counter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
          <TiltCard className="p-6 text-center">
            <div className="font-display text-4xl font-extrabold text-white">8</div>
            <div className="text-xs uppercase tracking-wider font-mono text-[#A9B1D6] mt-2">
              Core Subjects
            </div>
          </TiltCard>
          <TiltCard className="p-6 text-center">
            <div className="font-display text-4xl font-extrabold text-cyan-400">42</div>
            <div className="text-xs uppercase tracking-wider font-mono text-[#A9B1D6] mt-2">
              Structured Modules
            </div>
          </TiltCard>
          <TiltCard className="p-6 text-center">
            <div className="font-display text-4xl font-extrabold text-purple-400">184</div>
            <div className="text-xs uppercase tracking-wider font-mono text-[#A9B1D6] mt-2">
              High-Priority Concepts
            </div>
          </TiltCard>
        </div>
      </section>

      {/* Curriculum Grid Preview */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-purple-400 mb-2">
              The 8 Pillars of CS Interviews
            </div>
            <h2 className="font-display text-3xl font-bold text-white tracking-tight">
              Curriculum Architecture
            </h2>
          </div>
          <Link
            to="/design"
            className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
          >
            <span>View Design Tokens &amp; Components</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(SUBJECT_THEMES).map(([key, theme]) => (
            <GlassCard
              key={key}
              className="p-6 flex flex-col justify-between group hover:border-white/20 transition-all duration-300"
            >
              <div>
                <div
                  className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center text-white shadow-lg shadow-black/40"
                  style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
                >
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-white group-hover:text-purple-200 transition-colors">
                  {theme.name}
                </h3>
                <p className="text-xs text-[#A9B1D6] mt-2 leading-relaxed">
                  Comprehensive high-frequency interview concepts with real-world scenarios.
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-surface-border flex items-center justify-between text-xs font-mono">
                <span className="text-[#6B7399]">High Priority P0/P1</span>
                <span
                  className="font-semibold"
                  style={{ color: theme.from }}
                >
                  Explore &rarr;
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* How it Works / 5 Pillars */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
            The Mastery Pipeline
          </div>
          <h2 className="font-display text-3xl font-bold text-white tracking-tight">
            How Every Concept is Built
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'Learn', desc: 'Structured content blocks, diagrams, and code' },
            { step: '02', title: 'Video', desc: 'Short high-impact revision class with chapters' },
            { step: '03', title: 'Cheat Sheet', desc: 'Single-page revision matrix and JSON blocks' },
            { step: '04', title: 'Quiz', desc: 'Server-side auto-graded with zero answer leaks' },
            { step: '05', title: 'Interview Q&A', desc: 'Likely follow-up chains & model answers' },
          ].map((item, idx) => (
            <GlassCard key={idx} className="p-5 text-center space-y-2">
              <span className="font-mono text-xs text-purple-400 font-bold">{item.step}</span>
              <h4 className="font-display font-bold text-white">{item.title}</h4>
              <p className="text-xs text-[#A9B1D6] leading-relaxed">{item.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>
    </PageTransition>
  );
};
