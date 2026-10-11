import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Clock,
  BookOpen,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Database,
  ChevronRight,
} from 'lucide-react';

import { PageTransition } from '../components/layout/PageTransition';
import { GlassCard } from '../components/ui/Card';
import { DifficultyBadge, SubjectBadge } from '../components/ui/Badge';
import { LinearProgress } from '../components/ui/Progress';
import { Skeleton } from '../components/ui/Skeleton';
import { api } from '../lib/api';
import { SUBJECT_THEMES } from '../lib/constants';

export const SubjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Fetch Subject by Slug
  const { data: subject, isLoading } = useQuery({
    queryKey: ['subject-detail', slug],
    queryFn: async () => {
      const res = await api.get(`/subjects/${slug || 'dbms-sql'}`);
      return res.data.data;
    },
  });

  // Fetch Subject's Modules
  const { data: modules = [], isLoading: isModulesLoading } = useQuery({
    queryKey: ['subject-modules', subject?._id],
    enabled: !!subject?._id,
    queryFn: async () => {
      const res = await api.get(`/subjects/${subject._id}/modules`);
      return res.data.data;
    },
  });

  if (isLoading || isModulesLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  const theme = SUBJECT_THEMES[subject?.themeKey || 'dbms'] || SUBJECT_THEMES.dbms;

  return (
    <PageTransition className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Subject Gradient Header Banner */}
      <div className="relative rounded-3xl p-8 sm:p-12 glass-panel border border-surface-border overflow-hidden bg-gradient-to-r from-bg-1 to-bg-0">
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-bl-full pointer-events-none opacity-20 blur-3xl"
          style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
        />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full font-bold"
              style={{
                backgroundColor: `${theme.from}20`,
                borderColor: `${theme.from}40`,
                color: theme.from,
              }}
            >
              Curriculum Roadmap
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            {subject?.name}
          </h1>

          <p className="text-base text-[#A9B1D6] leading-relaxed">
            {subject?.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-[#A9B1D6]">
            <span>{(modules || []).length} Structured Modules</span>
            <span>&bull;</span>
            <span>
              {(modules || []).reduce((acc: number, m: { concepts?: unknown[] }) => acc + (m.concepts?.length || 0), 0)} High-Priority Concepts
            </span>
          </div>
        </div>
      </div>

      {/* Module Learning Path Roadmap */}
      <div className="space-y-8">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <h2 className="font-display text-2xl font-bold text-white tracking-tight">
            Learning Path &bull; Connected Modules
          </h2>
          <span className="text-xs font-mono text-[#6B7399]">
            Step-by-Step Prerequisite Flow
          </span>
        </div>

        <div className="space-y-6">
          {(modules || []).map((mod: { _id: string; order: number; name: string; description: string; concepts?: Array<{ _id: string; conceptCode: string; title: string; slug: string; difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'; estimatedMinutes: number }> }, idx: number) => (
            <GlassCard key={mod._id} className="p-6 sm:p-8 space-y-6 border border-surface-border group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border/60">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm text-white shadow-md"
                    style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
                  >
                    M{mod.order}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-white group-hover:text-purple-200 transition-colors">
                      {mod.name}
                    </h3>
                    <p className="text-xs text-[#A9B1D6] mt-0.5">{mod.description}</p>
                  </div>
                </div>

                <span className="text-xs font-mono text-cyan-400">
                  {mod.concepts?.length || 0} Concepts
                </span>
              </div>

              {/* Concepts List inside Module */}
              <div className="space-y-2">
                {mod.concepts?.map((c) => (
                  <Link
                    key={c._id}
                    to={`/concepts/${c.slug}`}
                    className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-surface-border flex items-center justify-between transition-colors group/item cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-purple-400">
                        {c.conceptCode}
                      </span>
                      <span className="text-sm text-white font-medium group-hover/item:text-cyan-300 transition-colors">
                        {c.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-[11px] font-mono text-[#6B7399]">
                        <Clock className="w-3 h-3" />
                        <span>{c.estimatedMinutes}m</span>
                      </div>
                      <DifficultyBadge difficulty={c.difficulty} />
                      <ChevronRight className="w-4 h-4 text-[#6B7399] group-hover/item:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};
