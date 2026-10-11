import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Sparkles,
  Layers,
  Database,
  Cpu,
  Globe,
  GitBranch,
  Server,
  Terminal,
  Info,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Send,
  HelpCircle,
  Award,
  Zap,
} from 'lucide-react';

import { PageTransition } from '../components/layout/PageTransition';
import { Button } from '../components/ui/Button';
import { GlassCard, TiltCard, GradientBorderCard } from '../components/ui/Card';
import {
  Badge,
  DifficultyBadge,
  StatusBadge,
  SubjectBadge,
} from '../components/ui/Badge';
import {
  LinearProgress,
  ProgressRing,
  StepsProgress,
  StepItem,
} from '../components/ui/Progress';
import { Tabs, TabItem } from '../components/ui/Tabs';
import { Accordion } from '../components/ui/Accordion';
import { Dialog } from '../components/ui/Dialog';
import { Tooltip } from '../components/ui/Tooltip';
import { Avatar } from '../components/ui/Avatar';
import { Skeleton } from '../components/ui/Skeleton';
import { StatTile } from '../components/ui/StatTile';
import { EmptyState } from '../components/ui/EmptyState';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { SUBJECT_THEMES } from '../lib/constants';

export const DesignShowcasePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [ringProgress, setRingProgress] = useState(68);

  const showcaseTabs: TabItem[] = [
    { id: 'overview', label: 'Overview', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'components', label: 'Primitives', count: 12 },
    { id: 'curriculum', label: 'Curriculum Themes', count: 8 },
  ];

  const stepsData: StepItem[] = [
    { id: '1', title: 'Learn Blocks', status: 'completed' },
    { id: '2', title: 'Revision Video', status: 'completed' },
    { id: '3', title: 'Cheat Sheet', status: 'current' },
    { id: '4', title: 'Quiz Grader', status: 'upcoming' },
  ];

  const accordionItems = [
    {
      id: 'acc-1',
      title: 'What is the "Aurora on Deep Space" aesthetic?',
      content:
        'A dark, cinematic base (#05060F) with luminous multi-colour gradient light, glassy surfaces (backdrop blur + saturate), soft glows, subtle film grain, and real 3D depth.',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'acc-2',
      title: 'How does CSF Livebook guard assessment questions?',
      content:
        'Under strict architectural security, the assessment schema marks correctAnswer with select:false. Learner-facing endpoints never receive answers or explanations prior to graded submission.',
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    {
      id: 'acc-3',
      title: 'What subjects are covered in the Master Curriculum?',
      content:
        'All 8 interview-critical subjects: DBMS & SQL, OOP, Operating Systems, Computer Networks, DevOps & Software Delivery, Computer Architecture, System Design, and GenAI Fundamentals.',
      icon: <Layers className="w-4 h-4" />,
    },
  ];

  return (
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full space-y-16">
      {/* Hero Header */}
      <div className="relative rounded-3xl p-8 sm:p-12 glass-panel border border-surface-border overflow-hidden bg-gradient-to-b from-purple-950/20 via-bg-1/80 to-bg-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/15 via-purple-600/15 to-transparent rounded-bl-full pointer-events-none blur-2xl" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Design System &amp; Tokens &bull; Phase 4</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            CSF Livebook <span className="aurora-text">Design System</span>
          </h1>

          <p className="text-base sm:text-lg text-[#A9B1D6] leading-relaxed">
            Storybook-style interactive showcase of design tokens, typography, glassmorphism surfaces, 3D tilt cards, gradient themes, and responsive UI components.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Tabs tabs={showcaseTabs} activeTab={activeTab} onChange={setActiveTab} />
            <div className="flex items-center gap-2 pl-4 border-l border-surface-border">
              <span className="text-xs text-[#6B7399] font-mono">Theme:</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* 1. PALETTES & TOKENS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <h2 className="font-display text-xl font-bold text-white tracking-tight">
              1. Curriculum Gradient Themes (8 Subjects)
            </h2>
          </div>
          <span className="text-xs font-mono text-[#6B7399]">WCAG AA Compliant</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(SUBJECT_THEMES).map(([key, theme]) => (
            <GlassCard key={key} className="p-4 space-y-3 group hover:border-white/20 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3.5 h-3.5 rounded-full shadow-md"
                    style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
                  />
                  <span className="font-display font-semibold text-sm text-white">{theme.name}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-[#A9B1D6] border border-surface-border">
                  {key}
                </span>
              </div>

              {/* Gradient Preview Bar */}
              <div
                className="h-10 rounded-xl shadow-inner flex items-center justify-between px-3 text-[11px] font-mono text-white/90 font-semibold"
                style={{ background: `linear-gradient(90deg, ${theme.from}, ${theme.to})` }}
              >
                <span>{theme.from}</span>
                <span>&rarr;</span>
                <span>{theme.to}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 2. BUTTONS & ACTIONS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
            <h2 className="font-display text-xl font-bold text-white tracking-tight">
              2. Button Primitives &amp; Micro-Interactions
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setButtonLoading(!buttonLoading)}
              className="text-xs"
            >
              Toggle Loading State
            </Button>
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-panel space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="cta" loading={buttonLoading} icon={<Zap className="w-4 h-4" />}>
              Primary CTA Shimmer
            </Button>
            <Button variant="primary" loading={buttonLoading} icon={<ArrowRight className="w-4 h-4" />}>
              Primary Solid
            </Button>
            <Button variant="secondary" loading={buttonLoading}>
              Secondary Glass
            </Button>
            <Button variant="glow" loading={buttonLoading} icon={<Flame className="w-4 h-4" />}>
              Aurora Glow
            </Button>
            <Button variant="ghost" loading={buttonLoading}>
              Ghost Button
            </Button>
            <Button variant="danger" loading={buttonLoading}>
              Danger Action
            </Button>
          </div>

          <div className="pt-4 border-t border-surface-border/50 flex flex-wrap items-center gap-4">
            <span className="text-xs font-mono text-[#6B7399]">Sizes:</span>
            <Button variant="primary" size="sm">Small (sm)</Button>
            <Button variant="primary" size="md">Medium (md)</Button>
            <Button variant="primary" size="lg">Large (lg)</Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<Send className="w-3.5 h-3.5" />}
              onClick={() => toast.success('Interactive notification triggered successfully!')}
            >
              Test Sonner Toast
            </Button>
          </div>
        </div>
      </section>

      {/* 3. CARDS & ELEVATION */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
            <h2 className="font-display text-xl font-bold text-white tracking-tight">
              3. Glassmorphism &amp; 3D Tilt Cards
            </h2>
          </div>
          <span className="text-xs font-mono text-[#6B7399]">Interactive Specular Parallax</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* GlassCard */}
          <GlassCard className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-white">GlassCard Surface</h3>
            <p className="text-sm text-[#A9B1D6] leading-relaxed">
              Multi-layered backdrop-filter with 20px blur, 140% saturation, and a delicate 1px border.
            </p>
            <div className="pt-2 text-xs font-mono text-cyan-400">Standard Surface Token</div>
          </GlassCard>

          {/* 3D TiltCard */}
          <TiltCard className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-white">3D TiltCard (Hover Me)</h3>
            <p className="text-sm text-[#A9B1D6] leading-relaxed">
              Reactive 3D perspective tilt that follows cursor movement with a specular glass glare gradient.
            </p>
            <div className="pt-2 text-xs font-mono text-purple-400">Interactive Parallax Glare</div>
          </TiltCard>

          {/* GradientBorderCard */}
          <GradientBorderCard className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center border border-pink-500/30">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-white">GradientBorderCard</h3>
            <p className="text-sm text-[#A9B1D6] leading-relaxed">
              Featured content container with glowing multi-stop linear gradient border and soft ambient shadow.
            </p>
            <div className="pt-2 text-xs font-mono text-pink-400">Featured Card Accent</div>
          </GradientBorderCard>
        </div>
      </section>

      {/* 4. BADGES, PROGRESS & STATS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h2 className="font-display text-xl font-bold text-white tracking-tight">
              4. Badges, Progress Rings &amp; Stat Tiles
            </h2>
          </div>
          <span className="text-xs font-mono text-[#6B7399]">SVG Linear &amp; Radial Vectors</span>
        </div>

        {/* Badges strip */}
        <div className="p-5 rounded-2xl glass-panel flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono text-[#6B7399] mr-2">Badges:</span>
          <DifficultyBadge difficulty="BEGINNER" />
          <DifficultyBadge difficulty="INTERMEDIATE" />
          <DifficultyBadge difficulty="ADVANCED" />
          <StatusBadge status="NOT_STARTED" />
          <StatusBadge status="IN_PROGRESS" />
          <StatusBadge status="COMPLETED" />
          <SubjectBadge themeKey="dbms" name="DBMS & SQL" />
          <SubjectBadge themeKey="os" name="Operating Systems" />
          <SubjectBadge themeKey="sd" name="System Design" />
        </div>

        {/* Progress & Stat Tiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatTile
            title="Total XP Earned"
            value="1,450 XP"
            subtitle="Top 5% of learners this week"
            icon={<Award className="w-5 h-5" />}
            trend={{ value: '+280 XP', isPositive: true }}
            accentColor="purple"
          />
          <StatTile
            title="Concepts Mastered"
            value="42 / 184"
            subtitle="P0 &amp; P1 high priority"
            icon={<Database className="w-5 h-5" />}
            accentColor="cyan"
          />
          <StatTile
            title="Daily Streak"
            value="7 Days"
            subtitle="Freeze protected"
            icon={<Flame className="w-5 h-5" />}
            trend={{ value: 'Record', isPositive: true }}
            accentColor="rose"
          />
          <StatTile
            title="Quiz Pass Rate"
            value="94.2%"
            subtitle="Average score: 88%"
            icon={<CheckCircle2 className="w-5 h-5" />}
            accentColor="emerald"
          />
        </div>

        {/* Steps Progress */}
        <GlassCard className="p-6 space-y-4">
          <h3 className="font-display text-base font-bold text-white">Lesson Multi-Step Pipeline</h3>
          <StepsProgress steps={stepsData} />
        </GlassCard>

        {/* Progress Bars and Rings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-6 space-y-5">
            <h3 className="font-display text-base font-bold text-white">Linear Progress Meters</h3>
            <LinearProgress value={78} label="DBMS & SQL Completion" colorTheme="cyan" />
            <LinearProgress value={45} label="Operating Systems" colorTheme="rose" />
            <LinearProgress value={92} label="Object-Oriented Programming" colorTheme="purple" />
          </GlassCard>

          <GlassCard className="p-6 flex items-center justify-around">
            <div className="text-center space-y-2">
              <ProgressRing value={ringProgress} size={110} strokeWidth={9} colorTheme="purple">
                <span className="font-display font-bold text-xl text-white">{ringProgress}%</span>
              </ProgressRing>
              <div className="text-xs font-mono text-[#A9B1D6]">Curriculum Progress</div>
              <button
                onClick={() => setRingProgress((prev) => (prev >= 100 ? 25 : prev + 15))}
                className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
              >
                Animate Progress &rarr;
              </button>
            </div>

            <div className="text-center space-y-2">
              <ProgressRing value={100} size={110} strokeWidth={9} colorTheme="emerald">
                <CheckCircle2 className="w-7 h-7 text-emerald-400 mx-auto" />
              </ProgressRing>
              <div className="text-xs font-mono text-emerald-400 font-semibold">C1 Mastered</div>
              <div className="text-[11px] text-[#6B7399]">Score: 100%</div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* 5. ACCORDIONS, DIALOGS, TOOLTIPS, SKELETONS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-pink-400" />
            <h2 className="font-display text-xl font-bold text-white tracking-tight">
              5. Complex Primitives (Accordion, Dialog, Tooltip, Skeletons)
            </h2>
          </div>
          <span className="text-xs font-mono text-[#6B7399]">Accessible &amp; Animated</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Accordion */}
          <div className="space-y-4">
            <h3 className="font-display text-base font-bold text-white">Collapsible Accordion</h3>
            <Accordion items={accordionItems} defaultExpanded={['acc-1']} />
          </div>

          {/* Dialog & Tooltip Showcase */}
          <div className="space-y-6">
            <GlassCard className="p-6 space-y-4">
              <h3 className="font-display text-base font-bold text-white">Modal Dialog &amp; Tooltips</h3>
              <p className="text-sm text-[#A9B1D6]">
                Click below to launch the modal dialog with backdrop blur and smooth scale+fade entrance.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button variant="primary" onClick={() => setIsDialogOpen(true)}>
                  Open Glass Modal
                </Button>

                <Tooltip content="Tooltip micro-interaction with hover fade" position="top">
                  <div className="p-2 rounded-xl glass-panel text-[#A9B1D6] hover:text-white cursor-help">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                </Tooltip>

                <div className="flex items-center gap-2">
                  <Avatar name="Arun Kumar" status="online" size="sm" />
                  <Avatar name="Sarah Lin" status="busy" size="md" />
                  <Avatar name="CSF Admin" status="away" size="lg" />
                </div>
              </div>
            </GlassCard>

            {/* Skeletons */}
            <GlassCard className="p-6 space-y-3">
              <h3 className="font-display text-base font-bold text-white">Shimmer Skeleton Loaders</h3>
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" className="w-12 h-12 flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-14 w-full mt-2" />
            </GlassCard>
          </div>
        </div>
      </section>

      {/* 6. EMPTY STATE */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <h2 className="font-display text-xl font-bold text-white tracking-tight">
              6. Empty State Component
            </h2>
          </div>
        </div>

        <EmptyState
          icon={<Terminal className="w-7 h-7" />}
          title="No Bookmarked Concepts Yet"
          description="You haven't bookmarked any concepts yet. While exploring DBMS or OS modules, click the bookmark icon on any concept header to save it for rapid pre-interview revision."
          actionLabel="Explore Curriculum"
          onAction={() => toast.info('Navigating to curriculum...')}
        />
      </section>

      {/* Interactive Modal Dialog Instance */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="CSF Livebook Architecture"
        description="Production MERN Stack with Strict TypeScript"
      >
        <div className="space-y-4 text-sm text-[#A9B1D6]">
          <p>
            You are viewing the native <strong className="text-white">Dialog</strong> primitive designed for CSF Livebook.
          </p>
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-200 text-xs font-mono space-y-1">
            <div>&bull; Glassmorphic backdrop blur (blur-md)</div>
            <div>&bull; Keyboard ESC listener &amp; body scroll lock</div>
            <div>&bull; Smooth spring entrance &amp; exit animation</div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="cta"
              size="sm"
              onClick={() => {
                setIsDialogOpen(false);
                toast.success('Confirmed from modal dialog!');
              }}
            >
              Understand
            </Button>
          </div>
        </div>
      </Dialog>
    </PageTransition>
  );
};
