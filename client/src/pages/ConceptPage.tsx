import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import {
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Layers,
  FileText,
  Play,
  Zap,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Share2,
  Menu,
  X,
  ArrowRight,
} from 'lucide-react';

import { PageTransition } from '../components/layout/PageTransition';
import { Button } from '../components/ui/Button';
import { DifficultyBadge, SubjectBadge } from '../components/ui/Badge';
import { Tabs, TabItem } from '../components/ui/Tabs';
import { BlockRenderer, ContentBlock } from '../components/content/BlockRenderer';
import { CustomVideoPlayer } from '../components/video/CustomVideoPlayer';
import { CheatSheetViewer } from '../components/cheatsheet/CheatSheetViewer';
import { Skeleton } from '../components/ui/Skeleton';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';

export const ConceptPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  const activeTab = searchParams.get('tab') || 'learn';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // 1. Fetch Concept Metadata by Slug
  const { data: concept, isLoading: isConceptLoading } = useQuery({
    queryKey: ['concept', slug],
    queryFn: async () => {
      const res = await api.get(`/concepts/slug/${slug || 'c1-dbms-vs-file-system'}`);
      return res.data.data;
    },
  });

  const conceptId = concept?._id;

  // 2. Fetch Concept Blocks & TOC
  const { data: contentData, isLoading: isContentLoading } = useQuery({
    queryKey: ['concept-content', conceptId],
    enabled: !!conceptId,
    queryFn: async () => {
      const res = await api.get(`/concepts/${conceptId}/content`);
      return res.data.data;
    },
  });

  // 3. Fetch Concept Resources (Video, Cheat Sheet)
  const { data: resources } = useQuery({
    queryKey: ['concept-resources', conceptId],
    enabled: !!conceptId,
    queryFn: async () => {
      const res = await api.get(`/concepts/${conceptId}/resources`);
      return res.data.data;
    },
  });

  // 4. Fetch Structured Cheat Sheet
  const { data: cheatSheet } = useQuery({
    queryKey: ['concept-cheatsheet', conceptId],
    enabled: !!conceptId,
    queryFn: async () => {
      const res = await api.get(`/concepts/${conceptId}/cheatsheet`);
      return res.data.data;
    },
  });

  // 5. Fetch Full Curriculum for Left Sidebar
  const { data: curriculumTree = [] } = useQuery({
    queryKey: ['curriculum-tree'],
    queryFn: async () => {
      const res = await api.get('/curriculum');
      return res.data.data;
    },
  });

  // Mark Concept Completed Mutation
  const completeMutation = useMutation({
    mutationFn: async () => {
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
  });

  // Toggle Bookmark
  const toggleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to bookmark concepts.');
      return;
    }
    try {
      if (isBookmarked) {
        await api.delete(`/users/me/bookmarks/${conceptId}`);
        setIsBookmarked(false);
        toast.info('Bookmark removed.');
      } else {
        await api.post(`/users/me/bookmarks/${conceptId}`);
        setIsBookmarked(true);
        toast.success('Concept bookmarked for pre-interview revision!');
      }
    } catch {
      toast.error('Unable to update bookmark.');
    }
  };

  // Scroll reading progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId });
  };

  const tabs: TabItem[] = [
    { id: 'learn', label: 'Learn', icon: <FileText className="w-4 h-4" /> },
    { id: 'video', label: 'Video', icon: <Play className="w-4 h-4" /> },
    { id: 'cheatsheet', label: 'Cheat Sheet', icon: <Zap className="w-4 h-4" /> },
    { id: 'quiz', label: 'Quiz', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'interview', label: 'Interview Q&A', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  if (isConceptLoading || isContentLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Skeleton className="h-96 hidden lg:block" />
          <div className="lg:col-span-3 space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-44 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const blocks: ContentBlock[] = contentData?.blocks || [];
  const toc = contentData?.tableOfContents || [];

  return (
    <PageTransition className="relative flex-1 flex flex-col w-full">
      {/* Top Fixed Reading Progress Bar */}
      <div className="fixed top-16 left-0 right-0 h-1 bg-white/5 z-40">
        <div
          className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Sticky Header with Breadcrumbs & Actions */}
      <div className="sticky top-16 z-30 w-full border-b border-surface-border bg-bg-1/85 backdrop-blur-xl px-4 sm:px-6 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-mono overflow-x-auto">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 rounded-lg glass-panel hover:bg-white/10 text-white cursor-pointer mr-1"
            >
              <Menu className="w-4 h-4" />
            </button>
            <Link to="/curriculum" className="text-[#6B7399] hover:text-white transition-colors">
              Curriculum
            </Link>
            <span className="text-[#6B7399]">&rsaquo;</span>
            <span className="text-[#A9B1D6] truncate max-w-[150px]">
              {concept?.module?.name || 'Database Fundamentals'}
            </span>
            <span className="text-[#6B7399]">&rsaquo;</span>
            <span className="text-cyan-400 font-bold">{concept?.conceptCode}</span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <DifficultyBadge difficulty={concept?.difficulty || 'BEGINNER'} />
              <span className="text-xs font-mono text-[#A9B1D6] px-2 py-0.5 rounded-full bg-white/5 border border-surface-border">
                {concept?.estimatedMinutes || 15}m
              </span>
            </div>

            <button
              onClick={toggleBookmark}
              aria-label="Bookmark concept"
              className="p-2 rounded-xl glass-panel border border-surface-border text-[#A9B1D6] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-purple-400 fill-purple-400" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3-Column Workspace Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Curriculum Sidebar (Desktop & Mobile Drawer) */}
        <aside
          className={`lg:col-span-3 sticky top-36 z-20 space-y-4 max-h-[calc(100vh-160px)] overflow-y-auto pr-2 ${
            sidebarOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="p-4 rounded-2xl glass-panel border border-surface-border space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-surface-border">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-purple-300">
                Curriculum Navigator
              </span>
              <span className="text-[10px] font-mono text-[#6B7399]">184 Concepts</span>
            </div>

            <div className="space-y-4 text-xs font-mono">
              {(Array.isArray(curriculumTree) ? curriculumTree : []).map((subj: any) => (
                <div key={subj._id} className="space-y-1.5">
                  <div className="font-bold text-white uppercase text-[11px] tracking-wider pt-1">
                    {subj.name}
                  </div>
                  {(subj.modules || []).map((mod: any) => (
                    <div key={mod._id} className="pl-2 border-l border-surface-border/50 space-y-1">
                      <div className="text-[11px] text-[#A9B1D6] font-semibold">{mod.name}</div>
                      {(mod.concepts || []).map((c: any) => {
                        const isCurrent = c.slug === slug;
                        return (
                          <Link
                            key={c._id}
                            to={`/concepts/${c.slug}`}
                            className={`block py-1 px-2 rounded-lg transition-colors truncate ${
                              isCurrent
                                ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 font-bold'
                                : 'text-[#6B7399] hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <span className="text-cyan-400 mr-1.5">{c.conceptCode}</span>
                            <span>{c.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center Column: Reading & Interactive Column (max ~720px) */}
        <main className="lg:col-span-6 w-full max-w-[720px] mx-auto space-y-8">
          {/* Concept Hero Heading */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 font-bold">
                {concept?.conceptCode} &bull; Must-Know Interview P0
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {concept?.title}
            </h1>
            <p className="text-sm text-[#A9B1D6] leading-relaxed">
              {concept?.description}
            </p>
          </div>

          {/* 5-Tab Segmented Control (Learn, Video, Cheat Sheet, Quiz, Interview) */}
          <div className="pt-2">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} size="md" />
          </div>

          {/* TAB 1: LEARN (Content Blocks System) */}
          {activeTab === 'learn' && (
            <div className="space-y-4">
              {(Array.isArray(blocks) ? blocks : []).map((block, idx) => (
                <BlockRenderer key={block.id || idx} block={block} />
              ))}

              {/* Completion Action Card */}
              <div className="mt-12 p-6 sm:p-8 rounded-3xl glass-panel border border-purple-500/30 bg-purple-950/20 text-center space-y-4 shadow-xl">
                <Sparkles className="w-8 h-8 text-cyan-400 mx-auto" />
                <h3 className="font-display font-bold text-xl text-white">
                  Completed this Lesson?
                </h3>
                <p className="text-xs sm:text-sm text-[#A9B1D6] max-w-md mx-auto">
                  Click below to lock in your +50 XP reward, update your streak, and advance to the Concept Quiz.
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <Button
                    variant="cta"
                    size="md"
                    onClick={() => completeMutation.mutate()}
                    loading={completeMutation.isPending}
                    icon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    Mark as Complete (+50 XP)
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => handleTabChange('quiz')}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Take Quiz Runner &rarr;
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VIDEO (Custom Accessible Player) */}
          {activeTab === 'video' && (
            <div className="space-y-6">
              <CustomVideoPlayer
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                conceptId={conceptId}
                initialPositionSec={resources?.video?.positionSec || 0}
                chapters={[
                  { title: 'The File System Architecture', timeSec: 0 },
                  { title: 'Data Redundancy & Anomaly Story', timeSec: 60 },
                  { title: 'ACID Guarantees Explained', timeSec: 180 },
                  { title: 'When Flat Files are Better', timeSec: 300 },
                  { title: 'Top Interview Follow-Up Chains', timeSec: 420 },
                ]}
              />
              <div className="p-4 rounded-xl glass-panel border border-surface-border text-xs text-[#A9B1D6] space-y-1">
                <span className="font-mono text-purple-300 font-semibold uppercase tracking-wider block">
                  Video Notes:
                </span>
                <div>&bull; Progress timestamp is automatically synced to your student profile.</div>
                <div>&bull; Use Keyboard shortcuts: <kbd className="font-mono bg-white/10 px-1 rounded">Space</kbd> Play/Pause, <kbd className="font-mono bg-white/10 px-1 rounded">&larr;/&rarr;</kbd> Seek, <kbd className="font-mono bg-white/10 px-1 rounded">F</kbd> Fullscreen.</div>
              </div>
            </div>
          )}

          {/* TAB 3: CHEAT SHEET (Printable Structured JSON Viewer) */}
          {activeTab === 'cheatsheet' && (
            <div className="space-y-6">
              <CheatSheetViewer
                data={
                  cheatSheet || {
                    conceptCode: concept?.conceptCode || 'C1',
                    title: concept?.title || 'DBMS vs File System',
                    sections: [
                      {
                        title: '1. Foundational Definition',
                        items: [
                          'File System: Stores raw OS bytes without schema awareness or transaction coordinators.',
                          'DBMS: Complete software system managing shared, persistent, structured data with ACID enforcement.',
                        ],
                      },
                      {
                        title: '2. Comparison Matrix',
                        table: {
                          headers: ['Feature', 'File System', 'DBMS'],
                          rows: [
                            ['Data Redundancy', 'Common across files', 'Minimized by normalization'],
                            ['Data Inconsistency', 'Frequent', 'Prevented via constraints & transactions'],
                            ['Concurrency', 'File-level lock', 'Row-level & MVCC isolation'],
                            ['Crash Recovery', 'Manual repair / fsck', 'WAL + Automatic replay recovery'],
                          ],
                        },
                      },
                      {
                        title: '3. When to Choose Flat Files',
                        items: [
                          'Sequential log append streaming (Kafka/Fluentd WAL)',
                          'Large static multimedia blobs (S3/Cloudflare R2)',
                          'Simple read-only configs loaded once at boot',
                        ],
                        keyTakeaway: 'In technical interviews, never say "DBMS is always better". State the exact trade-off: ACID vs Raw I/O throughput.',
                      },
                    ],
                  }
                }
              />
            </div>
          )}

          {/* TAB 4: QUIZ (Entry Card & Diagnostic Deep Links) */}
          {activeTab === 'quiz' && (
            <div className="space-y-6 p-8 rounded-3xl glass-panel border border-surface-border text-center">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/30">
                <HelpCircle className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-purple-400">
                  Concept C1 Graded Assessment
                </span>
                <h3 className="font-display font-bold text-2xl text-white">
                  5 Interview Questions &bull; 10 Minutes
                </h3>
                <p className="text-xs sm:text-sm text-[#A9B1D6] max-w-md mx-auto">
                  Server-side auto-graded with zero answer leakage. Tests concurrency, ACID anomalies, and system trade-offs.
                </p>
              </div>
              <div className="pt-2">
                <Link to={`/concepts/${slug}/quiz`}>
                  <Button variant="cta" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                    Launch Assessment Runner
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* TAB 5: INTERVIEW Q&A */}
          {activeTab === 'interview' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs">
                <strong>Interview Intelligence Register:</strong> High-frequency questions asked at Google, Meta, Amazon, and Stripe for backend/systems engineering positions.
              </div>
              {(Array.isArray(blocks) ? blocks : [])
                .filter((b) => b.type === 'interview_question')
                .map((b, idx) => (
                  <BlockRenderer key={idx} block={b} />
                ))}
            </div>
          )}
        </main>

        {/* Right Column: "On this page" Scroll-Spy TOC Sidebar */}
        <aside className="lg:col-span-3 sticky top-36 hidden lg:block space-y-4">
          <div className="p-4 rounded-2xl glass-panel border border-surface-border space-y-3">
            <span className="font-display font-bold text-xs uppercase tracking-wider text-[#A9B1D6] block">
              On This Page
            </span>
            <nav className="space-y-1 text-xs">
              {Array.isArray(toc) && toc.length > 0 ? (
                toc.map((item: { id: string; text: string; level: number }) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block py-1 transition-colors hover:text-white ${
                      item.level === 3 ? 'pl-3 text-[#6B7399]' : 'text-[#A9B1D6] font-medium'
                    }`}
                  >
                    {item.text}
                  </a>
                ))
              ) : (
                <div className="space-y-1 text-[#A9B1D6]">
                  <a href="#core-contrast" className="block py-1 hover:text-white">
                    1. The Core Contrast
                  </a>
                  <a href="#three-offices" className="block py-1 hover:text-white">
                    2. Three Offices Story
                  </a>
                  <a href="#acid-table" className="block py-1 hover:text-white">
                    3. ACID Guarantees
                  </a>
                  <a href="#when-to-use-files" className="block py-1 hover:text-white">
                    4. When Files are Better
                  </a>
                </div>
              )}
            </nav>
          </div>
        </aside>
      </div>
    </PageTransition>
  );
};
