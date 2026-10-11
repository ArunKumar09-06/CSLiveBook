import React, { useState, useEffect, useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
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
  ChevronDown,
  ChevronRight,
  RotateCcw,
  Search,
  Database,
  Boxes,
  Cpu,
  Network,
  GitBranch,
  HardDrive,
  Server,
  HelpCircle,
  Zap,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Filter,
} from 'lucide-react';

import { PageTransition } from '../components/layout/PageTransition';
import { Button } from '../components/ui/Button';
import { GlassCard, GradientBorderCard } from '../components/ui/Card';
import { StatTile } from '../components/ui/StatTile';
import { LinearProgress } from '../components/ui/Progress';
import { DifficultyBadge, SubjectBadge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { BlockRenderer, ContentBlock } from '../components/content/BlockRenderer';
import { CheatSheetViewer } from '../components/cheatsheet/CheatSheetViewer';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { SUBJECT_THEMES } from '../lib/constants';

interface Concept {
  _id: string;
  conceptCode: string;
  title: string;
  slug: string;
  description: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedMinutes: number;
  tags?: string[];
  order?: number;
}

interface Module {
  _id: string;
  name: string;
  slug: string;
  order: number;
  description?: string;
  concepts: Concept[];
}

interface Subject {
  _id: string;
  name: string;
  slug: string;
  themeKey: string;
  description?: string;
  icon?: string;
  modules: Module[];
}

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
}

const COURSE_ICONS: Record<string, React.ReactNode> = {
  dbms: <Database className="w-4 h-4" />,
  oop: <Boxes className="w-4 h-4" />,
  os: <Cpu className="w-4 h-4" />,
  cn: <Network className="w-4 h-4" />,
  devops: <GitBranch className="w-4 h-4" />,
  ca: <HardDrive className="w-4 h-4" />,
  sd: <Server className="w-4 h-4" />,
  ai: <Sparkles className="w-4 h-4" />,
};

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  if (user?.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  // 1. Fetch Student Dashboard Stats
  const { data: dashboard, isLoading: isDashboardLoading } = useQuery<DashboardData | null>({
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

  // 2. Fetch Full Curriculum Tree (All 8 Courses with Modules & Concepts)
  const { data: curriculum = [], isLoading: isCurriculumLoading } = useQuery<Subject[]>({
    queryKey: ['curriculum-tree'],
    queryFn: async () => {
      const res = await api.get('/curriculum');
      return res.data.data;
    },
  });

  // State for Course Separation and Syllabus Navigation
  const [selectedSubjectSlug, setSelectedSubjectSlug] = useState<string>('dbms-sql');
  const [selectedConceptId, setSelectedConceptId] = useState<string>('');
  const [syllabusSearch, setSyllabusSearch] = useState<string>('');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [activeReaderTab, setActiveReaderTab] = useState<'blocks' | 'cheatsheet' | 'quiz'>('blocks');
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});

  // Find currently active course
  const activeSubject = useMemo(() => {
    const list = Array.isArray(curriculum) ? curriculum : [];
    return list.find((s) => s.slug === selectedSubjectSlug) || list[0] || null;
  }, [curriculum, selectedSubjectSlug]);

  // Set default selected concept when active course changes
  useEffect(() => {
    if (activeSubject && activeSubject.modules && activeSubject.modules.length > 0) {
      // Find first concept in active subject
      const firstMod = activeSubject.modules[0];
      const firstConcept = firstMod?.concepts?.[0];
      if (firstConcept && (!selectedConceptId || !activeSubject.modules.some(m => (m.concepts || []).some(c => c._id === selectedConceptId)))) {
        setSelectedConceptId(firstConcept._id);
        setExpandedModules((prev) => ({ ...prev, [firstMod._id]: true }));
      }
    }
  }, [activeSubject, selectedConceptId]);

  // Find selected concept object and its parent module
  const { activeConcept, activeModule } = useMemo(() => {
    if (!activeSubject) return { activeConcept: null, activeModule: null };
    for (const mod of activeSubject.modules || []) {
      const found = (mod.concepts || []).find((c) => c._id === selectedConceptId);
      if (found) return { activeConcept: found, activeModule: mod };
    }
    const defaultMod = activeSubject.modules?.[0];
    const defaultConcept = defaultMod?.concepts?.[0] || null;
    return { activeConcept: defaultConcept, activeModule: defaultMod || null };
  }, [activeSubject, selectedConceptId]);

  // 3. Fetch Selected Concept Content Blocks
  const currentConceptId = activeConcept?._id;
  const { data: contentData, isLoading: isContentLoading } = useQuery({
    queryKey: ['concept-content', currentConceptId],
    enabled: !!currentConceptId,
    queryFn: async () => {
      const res = await api.get(`/concepts/${currentConceptId}/content`);
      return res.data.data;
    },
  });

  // 4. Fetch Selected Concept Cheat Sheet
  const { data: cheatSheetData } = useQuery({
    queryKey: ['concept-cheatsheet', currentConceptId],
    enabled: !!currentConceptId && activeReaderTab === 'cheatsheet',
    queryFn: async () => {
      try {
        const res = await api.get(`/concepts/${currentConceptId}/cheatsheet`);
        return res.data.data;
      } catch {
        return null;
      }
    },
  });

  // 5. Fetch Concept Quiz Preview
  const { data: quizData } = useQuery({
    queryKey: ['concept-quiz', currentConceptId],
    enabled: !!currentConceptId && activeReaderTab === 'quiz',
    queryFn: async () => {
      try {
        const res = await api.get(`/concepts/${currentConceptId}/quiz`);
        return res.data.data;
      } catch {
        return null;
      }
    },
  });

  // Mark Concept Completed Mutation
  const completeMutation = useMutation({
    mutationFn: async (conceptId: string) => {
      const res = await api.post(`/concepts/${conceptId}/complete`);
      return res.data;
    },
    onSuccess: (data) => {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#7C3AED', '#22D3EE', '#34D399', '#FBBF24'],
      });
      toast.success(data.message || 'Concept mastered! +50 XP awarded.');
      queryClient.invalidateQueries({ queryKey: ['student-dashboard'] });
    },
    onError: () => {
      toast.error('Unable to mark concept as complete.');
    },
  });

  // Toggle Module Accordion
  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  // Toggle Bookmark
  const toggleBookmark = async (conceptId: string) => {
    try {
      if (bookmarkedIds[conceptId]) {
        await api.delete(`/users/me/bookmarks/${conceptId}`);
        setBookmarkedIds((prev) => ({ ...prev, [conceptId]: false }));
        toast.info('Bookmark removed.');
      } else {
        await api.post(`/users/me/bookmarks/${conceptId}`);
        setBookmarkedIds((prev) => ({ ...prev, [conceptId]: true }));
        toast.success('Concept bookmarked for revision!');
      }
    } catch {
      toast.error('Unable to update bookmark.');
    }
  };

  // Find next concept in sequence
  const nextConcept = useMemo(() => {
    if (!activeSubject || !activeConcept) return null;
    const allConceptsInSubject = (activeSubject.modules || []).flatMap((m) => m.concepts || []);
    const currentIndex = allConceptsInSubject.findIndex((c) => c._id === activeConcept._id);
    if (currentIndex >= 0 && currentIndex < allConceptsInSubject.length - 1) {
      return allConceptsInSubject[currentIndex + 1];
    }
    return null;
  }, [activeSubject, activeConcept]);

  if (isDashboardLoading || isCurriculumLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <Skeleton className="h-28 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
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

  const safeCurriculum = Array.isArray(curriculum) ? curriculum : [];
  const blocks: ContentBlock[] = contentData?.blocks || [];

  return (
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* 1. Header Greeting & Real-time Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-purple-400">
              Student Command Center
            </span>
            <span className="text-[#6B7399]">&bull;</span>
            <span className="text-xs font-mono text-cyan-400">Master Syllabus &amp; Content Reader</span>
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
              <div className="text-[10px] text-[#A9B1D6]">Interview Master</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick KPIs Strip & Continue Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Continue Learning Hero Card */}
        <div className="lg:col-span-8">
          {continueItem ? (
            <GradientBorderCard className="p-6 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                    Resume Active Lesson
                  </span>
                  <SubjectBadge themeKey={continueItem.themeKey} name={continueItem.subjectName} />
                </div>

                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {continueItem.concept.conceptCode}: {continueItem.concept.title}
                  </h3>
                  <p className="text-xs text-[#A9B1D6] mt-1">
                    Ready to resume directly from your last saved reading position.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-[#6B7399]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{continueItem.concept.estimatedMinutes} mins remaining</span>
                  <span>&bull;</span>
                  <DifficultyBadge difficulty={continueItem.concept.difficulty} />
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <Link to={`/concepts/${continueItem.concept.slug}`}>
                  <Button variant="cta" size="sm" icon={<Play className="w-4 h-4 fill-white" />}>
                    Open Immersive View &rarr;
                  </Button>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSubjectSlug(continueItem.themeKey === 'dbms' ? 'dbms-sql' : 'dbms-sql');
                    setSelectedConceptId(continueItem.concept._id);
                  }}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                >
                  Inspect in Dashboard
                </button>
              </div>
            </GradientBorderCard>
          ) : (
            <GlassCard className="p-6 h-full flex flex-col justify-center items-center text-center space-y-3">
              <Sparkles className="w-6 h-6 text-cyan-400" />
              <h3 className="font-display text-lg font-bold text-white">Start Your Next Topic</h3>
              <p className="text-xs text-[#A9B1D6] max-w-sm">
                Kickstart your interview preparation with Concept C1 &ldquo;DBMS vs File System&rdquo;.
              </p>
              <Link to="/concepts/dbms-vs-file-system-dbms-vs-rdbms">
                <Button variant="cta" size="sm">
                  Launch Concept C1 &rarr;
                </Button>
              </Link>
            </GlassCard>
          )}
        </div>

        {/* Overview Metric Tiles */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-4">
          <StatTile
            title="Mastered"
            value={`${dashboard?.stats?.completedConcepts ?? 1} / 184`}
            subtitle={`${completionPct}% Completed`}
            icon={<BookOpen className="w-4 h-4 text-cyan-400" />}
            accentColor="cyan"
          />
          <StatTile
            title="Quizzes Passed"
            value={`${dashboard?.stats?.quizzesPassed ?? 1}`}
            subtitle="100% Score"
            icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            accentColor="emerald"
          />
          <StatTile
            title="Active Streak"
            value={`${streak} Days`}
            subtitle="Top 5% Consistency"
            icon={<Flame className="w-4 h-4 text-orange-400" />}
            accentColor="purple"
          />
          <StatTile
            title="Core XP"
            value={`${xp}`}
            subtitle="Senior Staff Track"
            icon={<Award className="w-4 h-4 text-purple-400" />}
            accentColor="purple"
          />
        </div>
      </div>

      {/* 3. SEPARATED COURSES SELECTOR STRIP */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>All 8 Courses Separated</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
              Choose a Course to View its Full Syllabus &amp; Content
            </h2>
          </div>
          <span className="text-xs font-mono text-[#6B7399]">184 Concepts Across 42 Modules</span>
        </div>

        {/* 8 Course Tabs Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {safeCurriculum.map((subj) => {
            const isSelected = subj.slug === selectedSubjectSlug;
            const theme = SUBJECT_THEMES[subj.themeKey] || SUBJECT_THEMES.dbms;
            const icon = COURSE_ICONS[subj.themeKey] || <BookOpen className="w-4 h-4" />;
            const totalConcepts = (subj.modules || []).reduce((acc, m) => acc + (m.concepts?.length || 0), 0);

            return (
              <button
                key={subj._id}
                type="button"
                onClick={() => {
                  setSelectedSubjectSlug(subj.slug);
                  setSyllabusSearch('');
                }}
                className={`p-3 rounded-2xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-2 border ${
                  isSelected
                    ? 'glass-panel bg-purple-600/25 border-purple-400 shadow-lg shadow-purple-950/50 ring-1 ring-purple-400/50'
                    : 'glass-panel bg-white/5 border-surface-border hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: `${theme.from}30`, color: theme.from }}
                  >
                    {icon}
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  )}
                </div>

                <div>
                  <div
                    className={`font-display text-xs font-bold truncate ${
                      isSelected ? 'text-white' : 'text-[#E0E7FF]'
                    }`}
                  >
                    {subj.name}
                  </div>
                  <div className="text-[10px] font-mono text-[#6B7399] mt-0.5">
                    {subj.modules?.length || 0} Modules &bull; {totalConcepts} Concepts
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. ACTIVE COURSE SYLLABUS & CONTENT WORKSPACE */}
      {activeSubject && (
        <div className="space-y-6 pt-2">
          {/* Active Course Banner */}
          <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-surface-border bg-bg-1/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30 flex-shrink-0">
                {COURSE_ICONS[activeSubject.themeKey] || <BookOpen className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-lg text-white">
                    {activeSubject.name}
                  </h3>
                  <SubjectBadge themeKey={activeSubject.themeKey} name="" />
                </div>
                <p className="text-xs text-[#A9B1D6]">
                  {activeSubject.description || 'Full curriculum syllabus and content blocks.'}
                </p>
              </div>
            </div>

            {/* Syllabus Search Filter */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#6B7399] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={syllabusSearch}
                onChange={(e) => setSyllabusSearch(e.target.value)}
                placeholder="Search topics in this syllabus..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl glass-panel bg-white/5 border border-surface-border text-xs text-white placeholder-[#6B7399] focus:outline-none focus:border-purple-400 transition-colors"
              />
            </div>
          </div>

          {/* 2-Column Split: Left = Course Syllabus Tree, Right = Live Content Block Reader */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Course Syllabus Tree (~4 cols) */}
            <div className="lg:col-span-4 space-y-3 max-h-[800px] overflow-y-auto pr-1">
              <div className="flex items-center justify-between px-1 pb-1 border-b border-surface-border">
                <span className="text-xs font-mono uppercase text-[#A9B1D6] font-bold">
                  Modules &amp; Syllabus Tree
                </span>
                <span className="text-[10px] font-mono text-[#6B7399]">
                  {(activeSubject.modules || []).length} Modules
                </span>
              </div>

              {(activeSubject.modules || []).map((module) => {
                const isExpanded = expandedModules[module._id] !== false; // default open
                const matchingConcepts = (module.concepts || []).filter((c) =>
                  syllabusSearch
                    ? c.title.toLowerCase().includes(syllabusSearch.toLowerCase()) ||
                      c.conceptCode.toLowerCase().includes(syllabusSearch.toLowerCase())
                    : true
                );

                if (syllabusSearch && matchingConcepts.length === 0) return null;

                return (
                  <div
                    key={module._id}
                    className="rounded-2xl glass-panel border border-surface-border overflow-hidden bg-bg-2/60"
                  >
                    {/* Module Accordion Header */}
                    <button
                      type="button"
                      onClick={() => toggleModule(module._id)}
                      className="w-full p-3.5 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono text-cyan-400 font-bold">
                          M{module.order}
                        </span>
                        <div>
                          <div className="font-display font-bold text-xs text-white">
                            {module.name}
                          </div>
                          <div className="text-[10px] text-[#6B7399] font-mono">
                            {matchingConcepts.length} Concepts
                          </div>
                        </div>
                      </div>
                      <div className="text-[#6B7399]">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </div>
                    </button>

                    {/* Concepts inside Module */}
                    {isExpanded && (
                      <div className="p-2 pt-0 space-y-1.5 border-t border-surface-border/40">
                        {matchingConcepts.map((c) => {
                          const isSelected = c._id === selectedConceptId;
                          return (
                            <button
                              key={c._id}
                              type="button"
                              onClick={() => setSelectedConceptId(c._id)}
                              className={`w-full p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between gap-2 border ${
                                isSelected
                                  ? 'bg-purple-600/30 border-purple-400/80 shadow-md ring-1 ring-purple-400/40 text-white'
                                  : 'bg-white/5 border-surface-border/60 hover:bg-white/10 hover:border-white/20 text-[#A9B1D6]'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className={`text-xs font-mono font-bold ${isSelected ? 'text-cyan-300' : 'text-purple-400'}`}>
                                  {c.conceptCode}
                                </span>
                                <span className="text-xs font-medium truncate text-white">
                                  {c.title}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <span className="text-[10px] font-mono text-[#6B7399]">
                                  {c.estimatedMinutes}m
                                </span>
                                <DifficultyBadge difficulty={c.difficulty} />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Column: Live Content Block Reader (~8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {activeConcept ? (
                <div className="space-y-4">
                  {/* Concept Header Card */}
                  <div className="p-6 rounded-3xl glass-panel border border-surface-border bg-bg-1/90 space-y-4 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      {/* Breadcrumbs */}
                      <div className="flex items-center gap-1.5 text-xs font-mono text-[#6B7399]">
                        <span>{activeSubject.name}</span>
                        <span>&rsaquo;</span>
                        <span>{activeModule?.name || 'Fundamentals'}</span>
                        <span>&rsaquo;</span>
                        <span className="text-cyan-400 font-bold">{activeConcept.conceptCode}</span>
                      </div>

                      {/* Header Actions */}
                      <div className="flex items-center gap-2">
                        <DifficultyBadge difficulty={activeConcept.difficulty} />
                        <span className="text-xs font-mono text-[#A9B1D6] px-2 py-0.5 rounded-full bg-white/5 border border-surface-border">
                          {activeConcept.estimatedMinutes}m
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleBookmark(activeConcept._id)}
                          aria-label="Bookmark this concept"
                          className="p-1.5 rounded-lg glass-panel hover:bg-white/10 text-[#A9B1D6] hover:text-white cursor-pointer"
                        >
                          {bookmarkedIds[activeConcept._id] ? (
                            <BookmarkCheck className="w-4 h-4 text-purple-400 fill-purple-400" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        {activeConcept.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#A9B1D6] mt-1.5 leading-relaxed">
                        {activeConcept.description}
                      </p>
                    </div>

                    {/* Quick Mode Switcher & Deep Links */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-surface-border/60">
                      {/* View Tabs */}
                      <div className="flex items-center gap-1.5 p-1 rounded-xl glass-panel bg-bg-2 border border-surface-border text-xs font-mono">
                        <button
                          type="button"
                          onClick={() => setActiveReaderTab('blocks')}
                          className={`px-3 py-1 rounded-lg cursor-pointer transition-colors ${
                            activeReaderTab === 'blocks'
                              ? 'bg-purple-600 text-white font-bold'
                              : 'text-[#A9B1D6] hover:text-white'
                          }`}
                        >
                          Content Blocks ({blocks.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveReaderTab('cheatsheet')}
                          className={`px-3 py-1 rounded-lg cursor-pointer transition-colors ${
                            activeReaderTab === 'cheatsheet'
                              ? 'bg-purple-600 text-white font-bold'
                              : 'text-[#A9B1D6] hover:text-white'
                          }`}
                        >
                          Cheat Sheet
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveReaderTab('quiz')}
                          className={`px-3 py-1 rounded-lg cursor-pointer transition-colors ${
                            activeReaderTab === 'quiz'
                              ? 'bg-purple-600 text-white font-bold'
                              : 'text-[#A9B1D6] hover:text-white'
                          }`}
                        >
                          Quiz Runner
                        </button>
                      </div>

                      {/* Immersive View Link */}
                      <Link to={`/concepts/${activeConcept.slug}`}>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<ExternalLink className="w-3.5 h-3.5" />}
                          className="text-xs"
                        >
                          Open Immersive Reader
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Active Tab View: Content Blocks */}
                  {activeReaderTab === 'blocks' && (
                    <div className="p-6 rounded-3xl glass-panel border border-surface-border bg-bg-1/70 space-y-6">
                      {isContentLoading ? (
                        <div className="space-y-4 py-8">
                          <Skeleton className="h-8 w-1/2" />
                          <Skeleton className="h-32 w-full" />
                          <Skeleton className="h-20 w-full" />
                        </div>
                      ) : blocks.length > 0 ? (
                        <div className="space-y-4">
                          {blocks.map((block, idx) => (
                            <BlockRenderer key={block.id || idx} block={block} />
                          ))}

                          {/* Completion & Navigation Action Footer */}
                          <div className="mt-8 pt-6 border-t border-surface-border flex flex-wrap items-center justify-between gap-4">
                            <Button
                              variant="cta"
                              size="md"
                              onClick={() => completeMutation.mutate(activeConcept._id)}
                              loading={completeMutation.isPending}
                              icon={<CheckCircle2 className="w-4 h-4" />}
                            >
                              Mark Lesson Complete (+50 XP)
                            </Button>

                            {nextConcept && (
                              <button
                                type="button"
                                onClick={() => setSelectedConceptId(nextConcept._id)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl glass-panel text-xs font-mono text-cyan-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                              >
                                <span>Next: {nextConcept.conceptCode} {nextConcept.title}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="py-12 text-center text-xs text-[#A9B1D6]">
                          No blocks registered for this concept yet.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Active Tab View: Cheat Sheet */}
                  {activeReaderTab === 'cheatsheet' && (
                    <div className="p-6 rounded-3xl glass-panel border border-surface-border bg-bg-1/70 space-y-4">
                      <CheatSheetViewer
                        data={
                          cheatSheetData?.content || cheatSheetData || {
                            conceptCode: activeConcept.conceptCode,
                            title: `${activeConcept.title} Cheat Sheet`,
                            sections: [
                              {
                                title: 'Core Principles',
                                items: [activeConcept.description],
                              },
                            ],
                          }
                        }
                      />
                    </div>
                  )}

                  {/* Active Tab View: Quiz Preview */}
                  {activeReaderTab === 'quiz' && (
                    <div className="p-8 rounded-3xl glass-panel border border-surface-border bg-bg-1/70 text-center space-y-5">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/30">
                        <HelpCircle className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-mono uppercase text-purple-400">
                          {activeConcept.conceptCode} Assessment Runner
                        </span>
                        <h3 className="font-display font-bold text-xl text-white">
                          Test Your Knowledge on {activeConcept.title}
                        </h3>
                        <p className="text-xs text-[#A9B1D6] max-w-md mx-auto">
                          Zero-leak graded interview assessment with timer, auto-save, and senior staff feedback rubric.
                        </p>
                      </div>
                      <div className="pt-2">
                        <Link to={`/concepts/${activeConcept.slug}/quiz`}>
                          <Button variant="cta" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                            Launch Quiz Runner &rarr;
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-12 rounded-3xl glass-panel border border-surface-border text-center space-y-3">
                  <BookOpen className="w-8 h-8 text-[#6B7399] mx-auto" />
                  <h3 className="font-display font-bold text-base text-white">Select a Concept</h3>
                  <p className="text-xs text-[#A9B1D6]">
                    Choose any concept from the syllabus tree on the left to inspect its blocks.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. Study Activity Heatmap & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Activity Heatmap */}
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
                  className={`h-9 rounded-xl flex items-center justify-center text-[10px] font-mono text-white ${bgColors[item.level]}`}
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
