import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

import { PageTransition } from '../components/layout/PageTransition';
import { Button } from '../components/ui/Button';
import { GlassCard, TiltCard, GradientBorderCard } from '../components/ui/Card';
import { StatTile } from '../components/ui/StatTile';
import { ProgressRing, LinearProgress } from '../components/ui/Progress';
import { Badge, DifficultyBadge, SubjectBadge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { SUBJECT_THEMES } from '../lib/constants';

interface DashboardData {
  user?: {
    name?: string;
    email?: string;
    xp?: number;
    streak?: { current?: number; longest?: number; lastActiveDate?: string };
    badges?: string[];
  };
  stats?: {
    completedConcepts?: number;
    inProgressConcepts?: number;
    totalConcepts?: number;
    completionPercentage?: number;
    quizzesPassed?: number;
  };
  overallProgress?: {
    total?: number;
    completed?: number;
    inProgress?: number;
    percentage?: number;
  };
  continueLearning?: {
    concept: {
      _id: string;
      conceptCode: string;
      title: string;
      slug: string;
      difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
      estimatedMinutes: number;
    };
    subjectName: string;
    themeKey: string;
    lastBlockId?: string;
    videoPositionSec?: number;
    status: string;
  } | null;
  resumeConcept?: any;
  subjectProgress?: {
    subjectId: string;
    subjectName: string;
    themeKey: string;
    slug: string;
    completed: number;
    total: number;
    percentage: number;
  }[];
  recentActivity?: {
    date: string;
    minutes: number;
    conceptsTouched: number;
    quizzesTaken: number;
  }[];
  recommendedNext?: {
    _id: string;
    conceptCode: string;
    title: string;
    slug: string;
    subjectName: string;
    themeKey: string;
    estimatedMinutes: number;
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  }[];
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  const { data: dashboard, isLoading } = useQuery<DashboardData | null>({
    queryKey: ['student-dashboard'],
    queryFn: async () => {
      try {
        const res = await api.get('/users/me/dashboard');
        return res.data.data;
      } catch {
        return null;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <Skeleton className="h-36 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const streak = dashboard?.user?.streak?.current ?? (user?.streak?.current || 3);
  const xp = dashboard?.user?.xp ?? (user?.xp || 450);
  const completionPct =
    dashboard?.stats?.completionPercentage ??
    dashboard?.overallProgress?.percentage ??
    24;
  const continueItem =
    dashboard?.continueLearning ||
    (dashboard?.resumeConcept
      ? {
          concept: dashboard.resumeConcept,
          subjectName: dashboard.resumeConcept.subjectName || 'DBMS & SQL',
          themeKey: dashboard.resumeConcept.subjectTheme || 'dbms-sql',
          lastBlockId: dashboard.resumeConcept.lastBlockId,
          videoPositionSec: dashboard.resumeConcept.videoPositionSec,
          status: dashboard.resumeConcept.status,
        }
      : null);

  return (
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* 1. Header Greeting & Streak Flame */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-purple-400">
              Student Command Center
            </span>
            <span className="text-[#6B7399]">&bull;</span>
            <span className="text-xs font-mono text-cyan-400">P0 &amp; P1 High-Priority Preparation</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="aurora-text">{user?.name || dashboard?.user?.name || 'Scholar'}</span>
          </h1>
        </div>

        {/* Streak & XP Badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-orange-500/15 to-rose-500/15 border border-orange-500/30 text-orange-400 font-mono shadow-lg shadow-orange-950/20">
            <Flame className="w-5 h-5 fill-orange-400 animate-pulse" />
            <div>
              <div className="text-xs font-bold leading-tight">{streak} Day Streak</div>
              <div className="text-[10px] text-[#A9B1D6]">Active Today</div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-purple-500/15 to-indigo-500/15 border border-purple-500/30 text-purple-300 font-mono shadow-lg shadow-purple-950/20">
            <Award className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-xs font-bold leading-tight">{xp} XP</div>
              <div className="text-[10px] text-[#A9B1D6]">Rank: Top 8%</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. "Continue Where You Left Off" Hero Card */}
      {continueItem ? (
        <GradientBorderCard className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                  Continue Where You Left Off
                </span>
                <SubjectBadge
                  themeKey={continueItem.themeKey}
                  name={continueItem.subjectName}
                />
              </div>

              <div>
                <h3 className="font-display text-2xl font-bold text-white tracking-tight">
                  {continueItem.concept.conceptCode}: {continueItem.concept.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#A9B1D6] mt-1">
                  Resumes directly from your last saved position{' '}
                  {continueItem.videoPositionSec
                    ? `(Video: ${Math.floor(continueItem.videoPositionSec / 60)}m)`
                    : '(Reading Block)'}
                  .
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-[#6B7399]">
                <Clock className="w-3.5 h-3.5" />
                <span>{continueItem.concept.estimatedMinutes} mins remaining</span>
                <span>&bull;</span>
                <DifficultyBadge difficulty={continueItem.concept.difficulty} />
              </div>
            </div>

            <div className="flex-shrink-0">
              <Link to={`/concepts/${continueItem.concept.slug}`}>
                <Button variant="cta" size="lg" icon={<Play className="w-5 h-5 fill-white" />}>
                  Resume Concept
                </Button>
              </Link>
            </div>
          </div>
        </GradientBorderCard>
      ) : (
        <GlassCard className="p-8 text-center space-y-4">
          <Sparkles className="w-8 h-8 text-cyan-400 mx-auto" />
          <h3 className="font-display text-xl font-bold text-white">Ready for Your Next Concept?</h3>
          <p className="text-xs text-[#A9B1D6] max-w-md mx-auto">
            Kickstart the interview master curriculum with Concept C1 &quot;DBMS vs File System&quot;.
          </p>
          <Link to="/concepts/dbms-vs-file-system-dbms-vs-rdbms">
            <Button variant="cta" size="sm">
              Launch Concept C1 &rarr;
            </Button>
          </Link>
        </GlassCard>
      )}

      {/* 3. Metric Stat Tiles Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          title="Mastered Concepts"
          value={`${dashboard?.stats?.completedConcepts ?? dashboard?.overallProgress?.completed ?? 1} / ${dashboard?.stats?.totalConcepts ?? dashboard?.overallProgress?.total ?? 184}`}
          subtitle={`${completionPct}% of Interview Core`}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          accentColor="emerald"
        />
        <StatTile
          title="Quizzes Passed"
          value={dashboard?.stats?.quizzesPassed ?? 1}
          subtitle="Passing threshold &ge; 80%"
          icon={<Award className="w-5 h-5 text-purple-400" />}
          accentColor="purple"
        />
        <StatTile
          title="Active Streak"
          value={`${streak} Days`}
          subtitle="Freeze protection active"
          icon={<Flame className="w-5 h-5 text-rose-400" />}
          accentColor="rose"
        />
        <StatTile
          title="Study Time"
          value="4.5 hrs"
          subtitle="This week's retention logs"
          icon={<Clock className="w-5 h-5 text-cyan-400" />}
          accentColor="cyan"
        />
      </div>

      {/* 4. Subject Progress Rings Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <h2 className="font-display text-xl font-bold text-white tracking-tight">
              Subject Mastery Roadmap (8 Subjects)
            </h2>
          </div>
          <Link to="/curriculum" className="text-xs font-mono text-cyan-400 hover:underline">
            View All 42 Modules &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(dashboard?.subjectProgress || Object.entries(SUBJECT_THEMES).map(([k, t]) => ({
            subjectId: k,
            subjectName: t.name,
            themeKey: k,
            slug: k,
            completed: k === 'dbms' ? 1 : 0,
            total: k === 'dbms' ? 38 : 25,
            percentage: k === 'dbms' ? 3 : 0,
          }))).map((subj) => (
            <GlassCard key={subj.subjectId} className="p-5 flex flex-col justify-between space-y-4 group">
              <div>
                <div className="flex items-start justify-between">
                  <span className="font-display font-bold text-sm text-white group-hover:text-purple-200 transition-colors">
                    {subj.subjectName}
                  </span>
                  <SubjectBadge themeKey={subj.themeKey} name="" />
                </div>
                <div className="text-xs font-mono text-[#6B7399] mt-1">
                  {subj.completed} / {subj.total} Concepts Completed
                </div>
              </div>

              <div className="space-y-2">
                <LinearProgress value={subj.percentage || 0} showLabel={false} colorTheme={subj.themeKey} />
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#A9B1D6]">{subj.percentage}% Mastered</span>
                  <Link to={`/subjects/${subj.slug}`} className="text-cyan-400 hover:underline">
                    Explore &rarr;
                  </Link>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* 5. Weekly Activity Heatmap & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Heatmap Mock */}
        <GlassCard className="p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <h3 className="font-display font-bold text-base text-white">
                Daily Study Activity Heatmap
              </h3>
            </div>
            <span className="text-xs font-mono text-[#6B7399]">Last 14 Days</span>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-2">
            {[
              { day: 'Mon', level: 2 },
              { day: 'Tue', level: 3 },
              { day: 'Wed', level: 1 },
              { day: 'Thu', level: 4 },
              { day: 'Fri', level: 3 },
              { day: 'Sat', level: 2 },
              { day: 'Sun', level: 4 },
              { day: 'Mon', level: 3 },
              { day: 'Tue', level: 4 },
              { day: 'Wed', level: 3 },
              { day: 'Thu', level: 2 },
              { day: 'Fri', level: 4 },
              { day: 'Sat', level: 3 },
              { day: 'Sun', level: 4 },
            ].map((item, idx) => {
              const bgColors = [
                'bg-white/5',
                'bg-purple-900/40 border border-purple-800/40',
                'bg-purple-700/60 border border-purple-600/50',
                'bg-purple-500/80 border border-purple-400/60',
                'bg-cyan-400 border border-cyan-300 shadow-md shadow-cyan-400/30',
              ];
              return (
                <div
                  key={idx}
                  title={`${item.day}: Active session`}
                  className={`h-10 rounded-xl flex items-center justify-center text-[10px] font-mono text-white ${bgColors[item.level]}`}
                >
                  {item.day}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-[#6B7399] pt-2 border-t border-surface-border">
            <span>Low Intensity</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-white/5" />
              <span className="w-2.5 h-2.5 rounded bg-purple-700/60" />
              <span className="w-2.5 h-2.5 rounded bg-cyan-400" />
            </div>
            <span>High Intensity</span>
          </div>
        </GlassCard>

        {/* Badges Earned Strip */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-400" />
            <h3 className="font-display font-bold text-base text-white">Unlocked Badges</h3>
          </div>

          <div className="space-y-3">
            {[
              { title: 'First Concept Mastered', desc: 'Completed Concept C1', date: 'Earned' },
              { title: '7-Day Streak Warrior', desc: 'Consistent interview practice', date: 'Earned' },
              { title: 'DBMS Pioneer', desc: 'ACID & Relational Foundations', date: 'In Progress' },
            ].map((badge, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/5 border border-surface-border flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center text-white text-xs font-bold shadow-md">
                  ★
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-white">{badge.title}</div>
                  <div className="text-[11px] text-[#A9B1D6]">{badge.desc}</div>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">{badge.date}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
};
