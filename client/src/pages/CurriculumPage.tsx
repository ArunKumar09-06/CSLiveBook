import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Database,
  Layers,
  Cpu,
  Globe,
  GitBranch,
  Server,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Clock,
  BookOpen,
} from 'lucide-react';

import { PageTransition } from '../components/layout/PageTransition';
import { GlassCard } from '../components/ui/Card';
import { DifficultyBadge, SubjectBadge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { api } from '../lib/api';
import { SUBJECT_THEMES } from '../lib/constants';

interface Concept {
  _id: string;
  conceptCode: string;
  title: string;
  slug: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedMinutes: number;
}

interface Module {
  _id: string;
  name: string;
  slug: string;
  order: number;
  concepts: Concept[];
}

interface Subject {
  _id: string;
  name: string;
  slug: string;
  themeKey: string;
  modules: Module[];
}

export const CurriculumPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  const { data: curriculum = [], isLoading } = useQuery<Subject[]>({
    queryKey: ['curriculum-tree'],
    queryFn: async () => {
      const res = await api.get('/curriculum');
      return res.data.data;
    },
  });

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  const filteredCurriculum = curriculum.filter((subj) => {
    if (selectedSubject !== 'all' && subj.slug !== selectedSubject) {
      return false;
    }
    return true;
  });

  return (
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono">
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>Complete Interview Syllabus</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Master Curriculum: <span className="aurora-text">184 Concepts</span>
        </h1>
        <p className="text-base text-[#A9B1D6] leading-relaxed">
          High-priority P0 and P1 interview concepts across 8 computer science subjects and 42 modules.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Subject Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
              selectedSubject === 'all'
                ? 'bg-purple-600 text-white'
                : 'glass-panel text-[#A9B1D6] hover:text-white'
            }`}
          >
            All Subjects
          </button>
          {curriculum.map((subj) => (
            <button
              key={subj._id}
              onClick={() => setSelectedSubject(subj.slug)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
                selectedSubject === subj.slug
                  ? 'bg-cyan-600 text-white'
                  : 'glass-panel text-[#A9B1D6] hover:text-white'
              }`}
            >
              {subj.name}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#6B7399] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search concepts or topics..."
            className="w-full pl-9 pr-4 py-2 rounded-xl glass-panel bg-white/5 border border-surface-border text-xs text-white placeholder-[#6B7399] focus:outline-none focus:border-purple-400"
          />
        </div>
      </div>

      {/* Curriculum Subject Blocks */}
      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-44 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-12">
          {filteredCurriculum.map((subject) => {
            const theme = SUBJECT_THEMES[subject.themeKey] || SUBJECT_THEMES.dbms;
            return (
              <div key={subject._id} className="space-y-4">
                {/* Subject Section Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-surface-border">
                  <div
                    className="w-3.5 h-3.5 rounded-full shadow-md"
                    style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
                  />
                  <h2 className="font-display text-2xl font-bold text-white tracking-tight">
                    {subject.name}
                  </h2>
                  <span className="text-xs font-mono text-[#6B7399] ml-auto">
                    {subject.modules.reduce((acc, m) => acc + (m.concepts?.length || 0), 0)} Concepts
                  </span>
                </div>

                {/* Modules Grid / List */}
                <div className="space-y-3">
                  {subject.modules.map((module) => {
                    const isExpanded = expandedModules[module._id] !== false; // Default open
                    const matchingConcepts = module.concepts.filter((c) =>
                      searchQuery ? c.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
                    );

                    if (searchQuery && matchingConcepts.length === 0) return null;

                    return (
                      <GlassCard key={module._id} className="overflow-hidden p-0 border border-surface-border">
                        {/* Module Accordion Header */}
                        <button
                          type="button"
                          onClick={() => toggleModule(module._id)}
                          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/5 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs text-cyan-400 font-semibold">
                              M{module.order}
                            </span>
                            <span className="font-display font-semibold text-white text-sm">
                              {module.name}
                            </span>
                            <span className="text-[11px] font-mono text-[#6B7399] px-2 py-0.5 rounded-full bg-white/5">
                              {matchingConcepts.length} concepts
                            </span>
                          </div>
                          <div className="text-[#6B7399]">
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </div>
                        </button>

                        {/* Concepts List */}
                        {isExpanded && (
                          <div className="px-5 pb-4 pt-1 divide-y divide-surface-border/40 border-t border-surface-border/50">
                            {matchingConcepts.map((concept) => (
                              <Link
                                key={concept._id}
                                to={`/concepts/${concept.slug}`}
                                className="py-2.5 flex items-center justify-between hover:text-cyan-300 transition-colors group cursor-pointer"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-xs font-mono text-purple-400 font-medium">
                                    {concept.conceptCode}
                                  </span>
                                  <span className="text-sm text-[#F5F7FF] group-hover:text-cyan-300 font-medium">
                                    {concept.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-[#6B7399]">
                                    <Clock className="w-3 h-3" />
                                    <span>{concept.estimatedMinutes}m</span>
                                  </div>
                                  <DifficultyBadge difficulty={concept.difficulty} />
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </GlassCard>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageTransition>
  );
};
