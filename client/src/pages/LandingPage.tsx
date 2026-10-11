import React, { Suspense, lazy, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
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
  HelpCircle,
  Play,
  FileText,
  CheckSquare,
  MessageSquare,
  ShieldAlert,
  ChevronRight,
  Flame,
} from 'lucide-react';

import { PageTransition } from '../components/layout/PageTransition';
import { Button } from '../components/ui/Button';
import { GlassCard, TiltCard, GradientBorderCard } from '../components/ui/Card';
import { Accordion } from '../components/ui/Accordion';
import { Badge, DifficultyBadge } from '../components/ui/Badge';
import { SUBJECT_THEMES } from '../lib/constants';

// Lazy-load 3D Knowledge Galaxy scene for optimal initial load time (<200KB initial chunk)
const KnowledgeGalaxy = lazy(() => import('../components/three/KnowledgeGalaxy'));

export const LandingPage: React.FC = () => {
  const [activeMockTab, setActiveMockTab] = useState<'learn' | 'video' | 'cheatsheet' | 'quiz' | 'interview'>('learn');
  const [revealedAnswer, setRevealedAnswer] = useState(false);

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#7C3AED', '#22D3EE', '#EC4899', '#34D399'],
    });
  };

  const faqItems = [
    {
      id: 'faq-1',
      title: 'How does CSF Livebook differ from generic LeetCode or textbooks?',
      content:
        'Standard interview sites focus on algorithmic coding problems, while textbooks are overly theoretical. CSF Livebook focuses specifically on the CS fundamentals concepts that interviewers grill candidates on: database locking, ACID anomalies, OS memory paging, TCP handshakes, and system scalability.',
    },
    {
      id: 'faq-2',
      title: 'What does the "Five-Pillar" lesson structure include?',
      content:
        'Every concept is a complete learning module consisting of: (1) Structured Learn Blocks with interactive 2D/3D visual diagrams, (2) High-impact video masterclass with chapters, (3) Exportable one-page cheat sheet, (4) Strict server-graded assessment quiz, and (5) Real interview follow-up Q&A chains.',
    },
    {
      id: 'faq-3',
      title: 'Are the quizzes graded on the server?',
      content:
        'Yes. In CSF Livebook, the assessment engine runs server-side with zero client-side answer leaks. Graded feedback includes targeted diagnostic links directly pointing back to the specific content block where the concept was explained.',
    },
    {
      id: 'faq-4',
      title: 'Can I track my streak and export cheat sheets?',
      content:
        'Yes. Daily activity logs power your streak flame and XP counters. All concept cheat sheets can be revised online or exported as cleanly formatted revision PDFs.',
    },
  ];

  return (
    <PageTransition className="relative flex-1 flex flex-col items-center overflow-hidden">
      {/* 1. HERO SECTION WITH 3D KNOWLEDGE GALAXY */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-20 flex flex-col items-center text-center">
        {/* Top Announcement Chip */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-xs text-purple-300 mb-6 border border-purple-500/30 shadow-lg shadow-purple-950/25"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>The CS Fundamentals Interview Master Curriculum</span>
        </motion.div>

        {/* Hero Headline */}
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
          className="text-lg sm:text-xl text-[#A9B1D6] max-w-2xl mb-8 leading-relaxed font-sans"
        >
          8 subjects &bull; 42 modules &bull; 184 high-priority concepts. Built with structured content blocks, 3D interactive diagrams, revision videos, and server-graded assessments.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-10 z-10"
        >
          <Link to="/register">
            <Button variant="cta" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
              Start Learning Free
            </Button>
          </Link>
          <Link to="/curriculum">
            <Button variant="secondary" size="lg" icon={<Sparkles className="w-5 h-5" />}>
              See the Full Syllabus (184 Concepts)
            </Button>
          </Link>
        </motion.div>

        {/* 3D Knowledge Galaxy Visual Canvas */}
        <div className="w-full max-w-5xl relative my-2">
          <div className="absolute inset-0 bg-gradient-to-t from-bg-0 via-transparent to-transparent z-10 pointer-events-none" />
          <Suspense
            fallback={
              <div className="w-full h-[450px] flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border border-purple-500/20 animate-spin flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-cyan-400/20 blur-md" />
                </div>
              </div>
            }
          >
            <KnowledgeGalaxy />
          </Suspense>
          <div className="text-[11px] font-mono text-[#6B7399] tracking-wider uppercase mt-2">
            Orbiting Galaxy: 8 Core Subjects &bull; Interactive Parallax &bull; Hover Orbs
          </div>
        </div>

        {/* Animated Metric Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl mt-12">
          <TiltCard className="p-6 text-center">
            <div className="font-display text-4xl sm:text-5xl font-extrabold text-white">8</div>
            <div className="text-xs uppercase tracking-wider font-mono text-[#A9B1D6] mt-2">
              Core Subjects
            </div>
          </TiltCard>
          <TiltCard className="p-6 text-center">
            <div className="font-display text-4xl sm:text-5xl font-extrabold text-cyan-400">42</div>
            <div className="text-xs uppercase tracking-wider font-mono text-[#A9B1D6] mt-2">
              Structured Modules
            </div>
          </TiltCard>
          <TiltCard className="p-6 text-center">
            <div className="font-display text-4xl sm:text-5xl font-extrabold text-purple-400">184</div>
            <div className="text-xs uppercase tracking-wider font-mono text-[#A9B1D6] mt-2">
              Must-Know P0/P1 Concepts
            </div>
          </TiltCard>
        </div>
      </section>

      {/* 2. HOW IT WORKS (THE 5-PILLAR JOURNEY) */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
            Structured Learning Architecture
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            How Every Single Concept is Mastered
          </h2>
          <p className="text-sm text-[#A9B1D6] mt-3">
            No endless 800-page textbooks. Every concept is engineered into a rapid, 5-stage mastery pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'Learn',
              icon: <FileText className="w-5 h-5 text-cyan-400" />,
              desc: 'Structured content blocks, comparison matrices, misconceptions, and 2D/3D visual diagrams.',
            },
            {
              step: '02',
              title: 'Video',
              icon: <Play className="w-5 h-5 text-purple-400" />,
              desc: 'Bite-sized revision masterclass with precise chapter markers and debounced playback position resume.',
            },
            {
              step: '03',
              title: 'Cheat Sheet',
              icon: <Zap className="w-5 h-5 text-amber-400" />,
              desc: 'High-density one-page revision sheet with formulas, comparison tables, and quick review matrices.',
            },
            {
              step: '04',
              title: 'Quiz',
              icon: <CheckSquare className="w-5 h-5 text-emerald-400" />,
              desc: 'Server-side graded assessments across 7 question types with zero client answer leakage.',
            },
            {
              step: '05',
              title: 'Interview Q&A',
              icon: <MessageSquare className="w-5 h-5 text-pink-400" />,
              desc: 'Likely interview questions, follow-up chains, and battle-tested model answers.',
            },
          ].map((item, idx) => (
            <GlassCard key={idx} className="p-6 flex flex-col justify-between space-y-4 group hover:border-white/20 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-purple-400">{item.step}</span>
                  <div className="p-2 rounded-lg bg-white/5 border border-surface-border">{item.icon}</div>
                </div>
                <h4 className="font-display font-bold text-base text-white group-hover:text-purple-200 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-[#A9B1D6] leading-relaxed mt-2">{item.desc}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 3. LIVE CONCEPT PREVIEW IN TILTED DEVICE MOCK */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-mono uppercase tracking-wider text-purple-400 mb-2">
            Interactive Lesson Engine
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Inside Concept C1: DBMS vs File System
          </h2>
          <p className="text-sm text-[#A9B1D6] mt-3">
            Preview the live concept workspace directly below. Switch between tabs to experience the student interface.
          </p>
        </div>

        {/* Device Mock Container */}
        <div className="relative rounded-3xl p-4 sm:p-6 glass-panel border border-surface-border/80 bg-bg-1/90 shadow-2xl shadow-purple-950/40">
          {/* Mock Window Header */}
          <div className="flex items-center justify-between border-b border-surface-border pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-[#6B7399] ml-2 hidden sm:inline">
                https://csflivebook.com/concepts/c1-dbms-vs-file-system
              </span>
            </div>

            <div className="flex items-center gap-2">
              <DifficultyBadge difficulty="BEGINNER" />
              <span className="text-xs font-mono text-[#A9B1D6] px-2 py-0.5 rounded-full bg-white/5 border border-surface-border">
                15 mins
              </span>
            </div>
          </div>

          {/* Lesson Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-cyan-400">DBMS &bull; Module 1 &bull; Concept C1</div>
              <h3 className="font-display text-2xl font-bold text-white mt-1">
                DBMS vs File System, DBMS vs RDBMS
              </h3>
            </div>

            {/* Segmented Mock Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl glass-panel bg-bg-2 border border-surface-border overflow-x-auto">
              {[
                { id: 'learn', label: 'Learn' },
                { id: 'video', label: 'Video' },
                { id: 'cheatsheet', label: 'Cheat Sheet' },
                { id: 'quiz', label: 'Quiz' },
                { id: 'interview', label: 'Interview Q&A' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveMockTab(tab.id as typeof activeMockTab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    activeMockTab === tab.id
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-[#A9B1D6] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Mock Content Area */}
          <div className="rounded-2xl p-6 bg-bg-0/60 border border-surface-border/60 min-h-[320px]">
            {activeMockTab === 'learn' && (
              <div className="space-y-6 max-w-2xl">
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs leading-relaxed flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Core Insight:</strong> A file system stores raw bytes without schema awareness or ACID concurrency guarantees. A DBMS provides self-describing metadata, declarative query optimization, and transaction isolation.
                  </div>
                </div>

                <div className="p-4 rounded-xl glass-panel border border-surface-border">
                  <div className="text-xs font-mono text-purple-300 mb-2 uppercase tracking-wider">
                    Interactive Diagram VB-1: Three Offices, Three Private Files
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300">
                      <strong>File System World:</strong><br />
                      Registrar &rarr; reg.txt<br />
                      Hostel &rarr; host.txt<br />
                      Library &rarr; lib.txt<br />
                      <em>Result: Redundancy &amp; Inconsistency</em>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                      <strong>DBMS World:</strong><br />
                      Apps &rarr; [ DBMS Core (Catalog) ]<br />
                      &darr;<br />
                      Single Shared Store<br />
                      <em>Result: Single Source of Truth</em>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeMockTab === 'video' && (
              <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-105 transition-transform">
                  <Play className="w-7 h-7 fill-white ml-1" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-white text-base">
                    Concept C1 Masterclass: 18-Minute Deep Dive
                  </h4>
                  <p className="text-xs text-[#A9B1D6]">
                    5 Chapters &bull; Resume Timestamp Sync &bull; Playback Speed &bull; Captions Track
                  </p>
                </div>
              </div>
            )}

            {activeMockTab === 'cheatsheet' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                  <span className="font-display font-semibold text-white text-sm">
                    High-Density Revision Matrix
                  </span>
                  <span className="text-xs font-mono text-purple-300">Ready to Export (PDF / PNG)</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl glass-panel">
                    <span className="text-cyan-400 block font-bold mb-1">Atomicity</span>
                    <span className="text-[#A9B1D6]">All or nothing execution handled via write-ahead logging (WAL).</span>
                  </div>
                  <div className="p-3 rounded-xl glass-panel">
                    <span className="text-purple-400 block font-bold mb-1">Consistency</span>
                    <span className="text-[#A9B1D6]">Transitions database only between legally valid states.</span>
                  </div>
                  <div className="p-3 rounded-xl glass-panel">
                    <span className="text-emerald-400 block font-bold mb-1">Isolation</span>
                    <span className="text-[#A9B1D6]">Concurrent transactions behave as if executed serially.</span>
                  </div>
                </div>
              </div>
            )}

            {activeMockTab === 'quiz' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-purple-400">Question 1 of 5 &bull; MCQ Single-Select</span>
                  <span className="text-xs font-mono text-[#6B7399]">Passing: 80%</span>
                </div>
                <p className="text-sm font-medium text-white">
                  Why does a file system fail to prevent data inconsistency during concurrent writes?
                </p>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl glass-panel border border-purple-500/40 bg-purple-600/10 text-xs text-white cursor-pointer flex items-center justify-between">
                    <span>Lack of centralized transaction manager and row-level lock coordinator</span>
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="p-3 rounded-xl glass-panel border border-surface-border text-xs text-[#A9B1D6] hover:bg-white/5 cursor-pointer">
                    <span>File systems do not support binary data formats</span>
                  </div>
                </div>
              </div>
            )}

            {activeMockTab === 'interview' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl glass-panel border border-surface-border space-y-3">
                  <div className="text-xs font-mono text-pink-400 uppercase tracking-wider">
                    Interview Question
                  </div>
                  <p className="text-sm font-semibold text-white">
                    &quot;When would you choose a flat file system over a relational database in production?&quot;
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setRevealedAnswer(!revealedAnswer)}
                  >
                    {revealedAnswer ? 'Hide Model Answer' : 'Reveal Model Answer'}
                  </Button>
                  {revealedAnswer && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-white/5 border border-surface-border text-xs text-[#A9B1D6] leading-relaxed"
                    >
                      <strong className="text-white">Model Answer:</strong> For sequential append-only telemetry/log streaming, large static media blobs (images/videos served via object storage/CDN), or simple read-only configs where ACID transactional overhead, query planning, and locking cost exceed raw I/O throughput.
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. SUBJECT SHOWCASE (ALL 8 SUBJECTS) */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
              Full Master Curriculum
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              8 Core Subjects &bull; 184 Concepts
            </h2>
          </div>
          <Link
            to="/curriculum"
            className="text-sm font-semibold text-purple-300 hover:text-white flex items-center gap-1 group"
          >
            <span>Explore Complete Curriculum Tree</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                  className="w-11 h-11 rounded-xl mb-4 flex items-center justify-center text-white shadow-lg shadow-black/40"
                  style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
                >
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-white group-hover:text-purple-200 transition-colors">
                  {theme.name}
                </h3>
                <p className="text-xs text-[#A9B1D6] mt-2 leading-relaxed">
                  Key interview questions, deep dive blocks, interactive diagrams, and assessments.
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-surface-border flex items-center justify-between text-xs font-mono">
                <span className="text-[#6B7399]">P0 / P1 Must-Know</span>
                <Link
                  to={`/subjects/${key}`}
                  className="font-semibold hover:underline"
                  style={{ color: theme.from }}
                >
                  View &rarr;
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 5. INTERVIEW INTELLIGENCE TEASER */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="rounded-3xl p-8 sm:p-12 glass-panel border border-surface-border bg-gradient-to-r from-purple-950/20 via-bg-1 to-bg-0 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Interview Intelligence Engine</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              Know What Interviewers Will Ask Before You Step In.
            </h2>
            <p className="text-sm text-[#A9B1D6] leading-relaxed">
              Every concept contains real-world question chains used at top tech companies. Never get caught off-guard by follow-up &quot;what if the database crashes during step 2?&quot; twists.
            </p>
            <div className="pt-2">
              <Link to="/register">
                <Button variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
                  Access All 184 Interview Guides
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl glass-panel border border-surface-border">
              <span className="text-xs font-mono text-cyan-400 block mb-1">Follow-up Chain #1</span>
              <p className="text-xs text-white font-medium">
                &quot;What happens if the primary database node crashes before WAL sync?&quot;
              </p>
            </div>
            <div className="p-4 rounded-xl glass-panel border border-surface-border">
              <span className="text-xs font-mono text-purple-400 block mb-1">Follow-up Chain #2</span>
              <p className="text-xs text-white font-medium">
                &quot;How does OS virtual memory avoid thrashing under high concurrency?&quot;
              </p>
            </div>
            <div className="p-4 rounded-xl glass-panel border border-surface-border">
              <span className="text-xs font-mono text-emerald-400 block mb-1">Follow-up Chain #3</span>
              <p className="text-xs text-white font-medium">
                &quot;Compare TCP 3-way handshake with TLS 1.3 zero-RTT resumption.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-20 space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400">
            Frequently Asked Questions
          </div>
          <h2 className="font-display text-3xl font-bold text-white tracking-tight">
            Everything You Need to Know
          </h2>
        </div>

        <Accordion items={faqItems} defaultExpanded={['faq-1']} />
      </section>

      {/* 7. FINAL CTA BANNER */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
        <GradientBorderCard className="p-10 sm:p-14 space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center mx-auto text-white shadow-xl shadow-purple-600/30">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to Crack Your Next <br />
            <span className="aurora-text">Computer Science Interview?</span>
          </h2>

          <p className="text-base text-[#A9B1D6] max-w-xl mx-auto leading-relaxed">
            Join thousands of engineering students preparing with the CS Fundamentals Interview Master Curriculum today.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link to="/register">
              <Button
                variant="cta"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                onClick={triggerCelebration}
              >
                Get Started Now &mdash; Free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </GradientBorderCard>
      </section>
    </PageTransition>
  );
};
