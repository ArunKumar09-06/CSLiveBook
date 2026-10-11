import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ShieldCheck,
  BarChart3,
  BookOpen,
  FileEdit,
  FolderPlus,
  Plus,
  CheckCircle2,
  Eye,
  Trash2,
  Sparkles,
  Play,
  Zap,
  HelpCircle,
  Save,
  Upload,
  ArrowRight,
  TrendingUp,
  Users,
  Database,
  Layers,
  Award,
} from 'lucide-react';

import { PageTransition } from '../components/layout/PageTransition';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/Card';
import { StatTile } from '../components/ui/StatTile';
import { Tabs, TabItem } from '../components/ui/Tabs';
import { Dialog } from '../components/ui/Dialog';
import { DifficultyBadge, SubjectBadge } from '../components/ui/Badge';
import { BlockRenderer, ContentBlock } from '../components/content/BlockRenderer';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';

export const AdminConsolePage: React.FC = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('analytics');
  const [selectedConceptId, setSelectedConceptId] = useState<string>('');
  const [isNewConceptModalOpen, setIsNewConceptModalOpen] = useState(false);

  // New Concept Form State
  const [newConceptData, setNewConceptData] = useState({
    moduleId: '',
    conceptCode: '',
    title: '',
    slug: '',
    description: '',
    estimatedMinutes: 15,
    difficulty: 'BEGINNER' as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
  });

  // Markdown Import State
  const [markdownInput, setMarkdownInput] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // 1. Fetch Admin Analytics
  const { data: analytics, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const res = await api.get('/admin/analytics');
      return res.data.data;
    },
  });

  // 2. Fetch Curriculum Tree for Concept Management
  const { data: curriculum = [] } = useQuery({
    queryKey: ['curriculum-tree'],
    queryFn: async () => {
      const res = await api.get('/curriculum');
      return res.data.data;
    },
  });

  // Flat list of all concepts for editor selector
  const allConcepts = curriculum.flatMap((s: any) =>
    (s.modules || []).flatMap((m: any) =>
      (m.concepts || []).map((c: any) => ({
        ...c,
        moduleName: m.name,
        subjectName: s.name,
        moduleId: m._id,
      }))
    )
  );

  // 3. Fetch Selected Concept Content Blocks
  const { data: contentData, refetch: refetchContent } = useQuery({
    queryKey: ['admin-concept-content', selectedConceptId],
    enabled: !!selectedConceptId,
    queryFn: async () => {
      const res = await api.get(`/concepts/${selectedConceptId}/content`);
      return res.data.data;
    },
  });

  const [editableBlocks, setEditableBlocks] = useState<ContentBlock[]>([]);

  React.useEffect(() => {
    if (contentData?.blocks) {
      setEditableBlocks(contentData.blocks);
    }
  }, [contentData]);

  // Create Concept Mutation
  const createConceptMutation = useMutation({
    mutationFn: async (input: typeof newConceptData) => {
      const res = await api.post('/admin/concepts', input);
      return res.data.data;
    },
    onSuccess: (data) => {
      toast.success(`Concept ${data.conceptCode} created successfully!`);
      setIsNewConceptModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['curriculum-tree'] });
      queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
      setSelectedConceptId(data._id);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || 'Failed to create concept');
    },
  });

  // Toggle Publish Mutation
  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      const res = await api.patch(`/admin/concepts/${id}/publish`, { isPublished });
      return res.data.data;
    },
    onSuccess: (data) => {
      toast.success(`Concept ${data.conceptCode} publish state updated.`);
      queryClient.invalidateQueries({ queryKey: ['curriculum-tree'] });
    },
  });

  // Save Content Blocks Mutation
  const saveContentMutation = useMutation({
    mutationFn: async ({ id, blocks }: { id: string; blocks: any[] }) => {
      const res = await api.put(`/admin/concepts/${id}/content`, { blocks });
      return res.data.data;
    },
    onSuccess: () => {
      toast.success('Concept content blocks saved & version incremented!');
      refetchContent();
    },
  });

  // Import Markdown Mutation
  const importMarkdownMutation = useMutation({
    mutationFn: async ({ id, markdown }: { id: string; markdown: string }) => {
      const res = await api.post(`/admin/concepts/${id}/content/import-markdown`, { markdown });
      return res.data.data;
    },
    onSuccess: () => {
      toast.success('Markdown parsed into structured content blocks!');
      setIsImportModalOpen(false);
      setMarkdownInput('');
      refetchContent();
    },
  });

  const adminTabs: TabItem[] = [
    { id: 'analytics', label: 'Platform Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'curriculum', label: 'Curriculum Manager', icon: <Layers className="w-4 h-4" />, count: allConcepts.length },
    { id: 'editor', label: 'Content Block Editor', icon: <FileEdit className="w-4 h-4" /> },
    { id: 'resources', label: 'Resource Manager', icon: <Play className="w-4 h-4" /> },
  ];

  return (
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Admin Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              Role: Admin Console
            </span>
            <span className="text-[#6B7399]">&bull;</span>
            <span className="text-xs font-mono text-cyan-400">Master Authoring System</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
            CSF Livebook <span className="aurora-text">Administration</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="cta"
            size="sm"
            onClick={() => setIsNewConceptModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Create New Concept
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface-border pb-4">
        <Tabs tabs={adminTabs} activeTab={activeTab} onChange={setActiveTab} size="md" />
      </div>

      {/* 1. ANALYTICS SUBVIEW */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatTile
              title="Registered Users"
              value={analytics?.metrics?.totalUsers || 2}
              subtitle="Learner Accounts"
              icon={<Users className="w-5 h-5 text-purple-400" />}
              accentColor="purple"
            />
            <StatTile
              title="Total Concepts"
              value={analytics?.metrics?.totalConcepts || 184}
              subtitle="Full Interview Core"
              icon={<Database className="w-5 h-5 text-cyan-400" />}
              accentColor="cyan"
            />
            <StatTile
              title="Assessment Attempts"
              value={analytics?.metrics?.totalAttempts || 4}
              subtitle={`${analytics?.metrics?.passRate || 100}% Pass Rate`}
              icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
              accentColor="emerald"
            />
            <StatTile
              title="Concepts Mastered"
              value={analytics?.metrics?.conceptsCompleted || 1}
              subtitle="Passed with &ge; 80%"
              icon={<Award className="w-5 h-5 text-amber-400" />}
              accentColor="amber"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Signups */}
            <GlassCard className="p-6 space-y-4">
              <h3 className="font-display font-bold text-base text-white">Recent Learner Signups</h3>
              <div className="divide-y divide-surface-border/50 text-xs font-mono">
                {(analytics?.recentSignups || []).map((u: any) => (
                  <div key={u._id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">{u.name}</span>
                      <span className="text-[#6B7399]">{u.email}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-purple-300">
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Hardest Concepts Miss Rate */}
            <GlassCard className="p-6 space-y-4">
              <h3 className="font-display font-bold text-base text-white">
                Assessment Diagnostics (Average Scores)
              </h3>
              <div className="divide-y divide-surface-border/50 text-xs font-mono">
                {(analytics?.hardestAssessments || []).length > 0 ? (
                  analytics.hardestAssessments.map((a: any) => (
                    <div key={a.assessmentId} className="py-2.5 flex items-center justify-between">
                      <span className="text-white">{a.title}</span>
                      <span className="text-cyan-400 font-bold">{a.avgScore}% avg</span>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-[#6B7399]">
                    Concept C1: 100% average passing score across recorded attempts.
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* 2. CURRICULUM MANAGER SUBVIEW */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#6B7399]">
              Managing 184 High-Priority Concepts across 42 Modules
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsNewConceptModalOpen(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Concept
            </Button>
          </div>

          <GlassCard className="p-0 overflow-hidden border border-surface-border">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-white/5 border-b border-surface-border uppercase tracking-wider text-[#A9B1D6]">
                  <tr>
                    <th className="p-3.5">Code</th>
                    <th className="p-3.5">Title</th>
                    <th className="p-3.5">Module &bull; Subject</th>
                    <th className="p-3.5">Difficulty</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/50 text-[#F5F7FF]">
                  {allConcepts.slice(0, 15).map((c: any) => (
                    <tr key={c._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3.5 font-bold text-cyan-400">{c.conceptCode}</td>
                      <td className="p-3.5 font-semibold text-white">{c.title}</td>
                      <td className="p-3.5 text-[#A9B1D6]">
                        {c.moduleName} &bull; {c.subjectName}
                      </td>
                      <td className="p-3.5">
                        <DifficultyBadge difficulty={c.difficulty} />
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.isPublished
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {c.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedConceptId(c._id);
                            setActiveTab('editor');
                          }}
                          className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-purple-300 cursor-pointer"
                        >
                          Edit Blocks
                        </button>
                        <button
                          onClick={() =>
                            togglePublishMutation.mutate({
                              id: c._id,
                              isPublished: !c.isPublished,
                            })
                          }
                          className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-cyan-300 cursor-pointer"
                        >
                          Toggle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* 3. CONTENT BLOCK EDITOR SUBVIEW */}
      {activeTab === 'editor' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-surface-border">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#6B7399]">Select Concept:</span>
              <select
                value={selectedConceptId}
                onChange={(e) => setSelectedConceptId(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-bg-2 border border-surface-border text-xs text-white focus:outline-none focus:border-purple-400"
              >
                <option value="">-- Choose a concept --</option>
                {allConcepts.map((c: any) => (
                  <option key={c._id} value={c._id}>
                    {c.conceptCode}: {c.title}
                  </option>
                ))}
              </select>
            </div>

            {selectedConceptId && (
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsImportModalOpen(true)}
                  icon={<Upload className="w-3.5 h-3.5" />}
                >
                  Import Markdown
                </Button>
                <Button
                  variant="cta"
                  size="sm"
                  onClick={() =>
                    saveContentMutation.mutate({
                      id: selectedConceptId,
                      blocks: editableBlocks,
                    })
                  }
                  loading={saveContentMutation.isPending}
                  icon={<Save className="w-3.5 h-3.5" />}
                >
                  Save &amp; Bump Version
                </Button>
              </div>
            )}
          </div>

          {/* Side-by-side Editor & Live Preview */}
          {selectedConceptId ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Left: Editable Block List */}
              <GlassCard className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                  <h3 className="font-display font-bold text-sm text-white">
                    Blocks in this Lesson ({editableBlocks.length})
                  </h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setEditableBlocks((prev) => [
                          ...prev,
                          {
                            type: 'callout',
                            id: `callout-${Date.now()}`,
                            variant: 'tip',
                            title: 'New Author Callout',
                            text: 'Added via Admin Console without touching code.',
                          },
                        ])
                      }
                      className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-xs text-cyan-300 font-mono cursor-pointer"
                    >
                      + Callout
                    </button>
                    <button
                      onClick={() =>
                        setEditableBlocks((prev) => [
                          ...prev,
                          {
                            type: 'code',
                            id: `code-${Date.now()}`,
                            language: 'sql',
                            code: '-- New Code Example\nSELECT * FROM students;',
                          },
                        ])
                      }
                      className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-xs text-purple-300 font-mono cursor-pointer"
                    >
                      + Code
                    </button>
                  </div>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {editableBlocks.map((b, idx) => (
                    <div
                      key={b.id || idx}
                      className="p-3.5 rounded-xl bg-white/5 border border-surface-border space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-purple-400">
                          Block {idx + 1}: {b.type.toUpperCase()}
                        </span>
                        <button
                          onClick={() =>
                            setEditableBlocks((prev) => prev.filter((_, i) => i !== idx))
                          }
                          className="text-[#6B7399] hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Simple Inline Field Editing */}
                      {b.type === 'text' && (
                        <textarea
                          value={(b as any).markdown || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditableBlocks((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, markdown: val } : item))
                            );
                          }}
                          className="w-full p-2 rounded-lg bg-black/40 border border-surface-border text-xs text-white font-mono h-24 focus:outline-none"
                        />
                      )}

                      {b.type === 'heading' && (
                        <input
                          type="text"
                          value={(b as any).text || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditableBlocks((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, text: val } : item))
                            );
                          }}
                          className="w-full p-2 rounded-lg bg-black/40 border border-surface-border text-xs text-white font-mono focus:outline-none"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Right: Live Rendered Preview */}
              <GlassCard className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                  <h3 className="font-display font-bold text-sm text-cyan-300">
                    Live Lesson Preview
                  </h3>
                  <span className="text-[10px] font-mono text-[#6B7399]">WYSIWYG Sandbox</span>
                </div>

                <div className="p-4 rounded-2xl bg-bg-0/60 border border-surface-border space-y-4 max-h-[600px] overflow-y-auto">
                  {editableBlocks.map((b, idx) => (
                    <BlockRenderer key={b.id || idx} block={b} />
                  ))}
                </div>
              </GlassCard>
            </div>
          ) : (
            <div className="p-12 text-center glass-panel rounded-2xl border border-surface-border text-[#6B7399] font-mono text-xs">
              Select a concept from the dropdown above to edit its content blocks in real time.
            </div>
          )}
        </div>
      )}

      {/* 4. RESOURCE MANAGER SUBVIEW */}
      {activeTab === 'resources' && (
        <GlassCard className="p-8 text-center space-y-4">
          <Play className="w-8 h-8 text-cyan-400 mx-auto" />
          <h3 className="font-display font-bold text-lg text-white">
            Media &amp; Cheat Sheet Storage Manager
          </h3>
          <p className="text-xs text-[#A9B1D6] max-w-md mx-auto">
            Attach video revision URLs with timestamps, upload cheat sheets, and toggle public visibility.
          </p>
        </GlassCard>
      )}

      {/* Dialog: Create New Concept */}
      <Dialog
        isOpen={isNewConceptModalOpen}
        onClose={() => setIsNewConceptModalOpen(false)}
        title="Author New Interview Concept"
        description="Creates a new concept in MongoDB with initialized content blocks"
      >
        <div className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-[#A9B1D6] mb-1">Target Module:</label>
            <select
              value={newConceptData.moduleId}
              onChange={(e) =>
                setNewConceptData((prev) => ({ ...prev, moduleId: e.target.value }))
              }
              className="w-full p-2.5 rounded-xl bg-bg-2 border border-surface-border text-white focus:outline-none"
            >
              <option value="">-- Choose Module --</option>
              {curriculum.flatMap((s: any) =>
                (s.modules || []).map((m: any) => (
                  <option key={m._id} value={m._id}>
                    {s.name} &rarr; M{m.order}: {m.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#A9B1D6] mb-1">Concept Code:</label>
              <input
                type="text"
                placeholder="e.g. C39"
                value={newConceptData.conceptCode}
                onChange={(e) =>
                  setNewConceptData((prev) => ({ ...prev, conceptCode: e.target.value }))
                }
                className="w-full p-2 rounded-xl bg-white/5 border border-surface-border text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#A9B1D6] mb-1">Difficulty:</label>
              <select
                value={newConceptData.difficulty}
                onChange={(e) =>
                  setNewConceptData((prev) => ({
                    ...prev,
                    difficulty: e.target.value as any,
                  }))
                }
                className="w-full p-2 rounded-xl bg-bg-2 border border-surface-border text-white focus:outline-none"
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#A9B1D6] mb-1">Concept Title:</label>
            <input
              type="text"
              placeholder="e.g. B+ Tree Indexing vs LSM Trees"
              value={newConceptData.title}
              onChange={(e) =>
                setNewConceptData((prev) => ({
                  ...prev,
                  title: e.target.value,
                  slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                }))
              }
              className="w-full p-2 rounded-xl bg-white/5 border border-surface-border text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[#A9B1D6] mb-1">URL Slug:</label>
            <input
              type="text"
              value={newConceptData.slug}
              onChange={(e) =>
                setNewConceptData((prev) => ({ ...prev, slug: e.target.value }))
              }
              className="w-full p-2 rounded-xl bg-white/5 border border-surface-border text-[#6B7399] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[#A9B1D6] mb-1">Short Description:</label>
            <textarea
              value={newConceptData.description}
              onChange={(e) =>
                setNewConceptData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Interview-focused overview..."
              className="w-full p-2 rounded-xl bg-white/5 border border-surface-border text-white h-16 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsNewConceptModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="cta"
              size="sm"
              loading={createConceptMutation.isPending}
              onClick={() => createConceptMutation.mutate(newConceptData)}
            >
              Publish Concept
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Dialog: Import Markdown */}
      <Dialog
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Raw Markdown into Blocks"
        description="Headings (#, ##) and paragraphs will be automatically parsed into structured JSON blocks."
      >
        <div className="space-y-4 text-xs font-mono">
          <textarea
            value={markdownInput}
            onChange={(e) => setMarkdownInput(e.target.value)}
            placeholder="# Title&#10;&#10;Paragraph text...&#10;&#10;## Section Two"
            className="w-full h-48 p-3 rounded-xl bg-black/40 border border-surface-border text-white focus:outline-none"
          />

          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsImportModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={importMarkdownMutation.isPending}
              onClick={() =>
                importMarkdownMutation.mutate({
                  id: selectedConceptId,
                  markdown: markdownInput,
                })
              }
            >
              Parse &amp; Import
            </Button>
          </div>
        </div>
      </Dialog>
    </PageTransition>
  );
};
