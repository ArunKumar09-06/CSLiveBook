import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Clock,
  Flag,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  HelpCircle,
  X,
} from 'lucide-react';

import { PageTransition } from '../components/layout/PageTransition';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/Card';
import { ProgressRing } from '../components/ui/Progress';
import { Dialog } from '../components/ui/Dialog';
import { Skeleton } from '../components/ui/Skeleton';
import { api } from '../lib/api';
import { formatTime } from '../lib/utils';
import { useAuthStore } from '../stores/authStore';

interface QuestionOption {
  id: string;
  text: string;
}

interface Question {
  _id: string;
  type: string;
  prompt: string;
  options: QuestionOption[];
  points: number;
}

interface QuizData {
  _id: string;
  title: string;
  conceptId?: string;
  passingScore: number;
  timeLimit: number;
  questions: Question[];
}

export const QuizRunnerPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(600);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [autosaveStatus, setAutosaveStatus] = useState<'saved' | 'saving'>('saved');

  // 1. Fetch Concept by Slug to get conceptId
  const { data: concept } = useQuery({
    queryKey: ['concept-for-quiz', slug],
    queryFn: async () => {
      const res = await api.get(`/concepts/slug/${slug || 'c1-dbms-vs-file-system'}`);
      return res.data.data;
    },
  });

  const conceptId = concept?._id;

  // 2. Fetch Quiz Questions (Public questions without answer leakage)
  const { data: quiz, isLoading } = useQuery<QuizData>({
    queryKey: ['concept-quiz', conceptId],
    enabled: !!conceptId,
    queryFn: async () => {
      const res = await api.get(`/concepts/${conceptId}/quiz`);
      return res.data.data;
    },
  });

  // Initialize timer once quiz loads
  useEffect(() => {
    if (quiz?.timeLimit) {
      setSecondsRemaining(quiz.timeLimit);
    }
  }, [quiz?.timeLimit]);

  // Countdown Timer
  useEffect(() => {
    if (secondsRemaining <= 0) {
      handleSubmitQuiz();
      return;
    }
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsRemaining]);

  // Start attempt on mount if authenticated
  useEffect(() => {
    if (isAuthenticated && quiz?._id && !attemptId) {
      api
        .post(`/assessments/${quiz._id}/start`)
        .then((res) => {
          setAttemptId(res.data.data._id);
        })
        .catch(() => {});
    }
  }, [isAuthenticated, quiz?._id, attemptId]);

  // Autosave current question response
  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    setAutosaveStatus('saving');

    if (attemptId) {
      api
        .patch(`/assessments/attempts/${attemptId}/autosave`, {
          questionId,
          response: optionId,
        })
        .then(() => setAutosaveStatus('saved'))
        .catch(() => setAutosaveStatus('saved'));
    } else {
      setTimeout(() => setAutosaveStatus('saved'), 300);
    }
  };

  const toggleFlag = (questionId: string) => {
    setFlagged((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  // Submit and Grade Mutation
  const submitMutation = useMutation({
    mutationFn: async () => {
      const formattedAnswers = Object.entries(answers).map(([qId, response]) => ({
        questionId: qId,
        response,
      }));

      const res = await api.post(`/assessments/${quiz?._id}/attempts`, {
        attemptId,
        answers: formattedAnswers,
      });
      return res.data.data;
    },
    onSuccess: (result) => {
      toast.success('Assessment graded successfully!');
      navigate(`/concepts/${slug}/quiz/result`, { state: { result, concept } });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error?.message || 'Failed to submit assessment.');
    },
  });

  const handleSubmitQuiz = () => {
    setIsSubmitDialogOpen(false);
    submitMutation.mutate();
  };

  // Keyboard Shortcuts: Keys 1-4 for options, Enter for next, F for flag
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!quiz?.questions || quiz.questions.length === 0) return;
      const currentQ = quiz.questions[currentIndex];
      if (!currentQ) return;

      if (['1', '2', '3', '4'].includes(e.key)) {
        const optIdx = parseInt(e.key) - 1;
        if (currentQ.options && currentQ.options[optIdx]) {
          handleSelectOption(currentQ._id, currentQ.options[optIdx].id);
        }
      } else if (e.key === 'Enter') {
        if (currentIndex < quiz.questions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setIsSubmitDialogOpen(true);
        }
      } else if (e.key.toLowerCase() === 'f') {
        toggleFlag(currentQ._id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quiz, currentIndex, answers]);

  if (isLoading || !quiz) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const questions = quiz.questions || [];
  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <PageTransition className="min-h-screen flex flex-col bg-bg-0 text-[#F5F7FF] relative">
      {/* Focus Mode Sticky Header */}
      <header className="sticky top-0 z-40 w-full border-b border-surface-border bg-bg-1/90 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to={`/concepts/${slug}?tab=quiz`}
            className="p-1.5 rounded-lg glass-panel text-[#6B7399] hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </Link>
          <span className="font-display font-bold text-sm text-white">
            Focus Mode &bull; {quiz.title}
          </span>
        </div>

        {/* Timer & Autosave Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#A9B1D6]">
            <span
              className={`w-2 h-2 rounded-full ${
                autosaveStatus === 'saving' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
              }`}
            />
            <span className="hidden sm:inline">
              {autosaveStatus === 'saving' ? 'Saving...' : 'Autosaved'}
            </span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono text-xs font-bold border ${
              secondsRemaining < 60
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-400 animate-pulse'
                : 'glass-panel border-surface-border text-cyan-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(secondsRemaining)}</span>
          </div>
        </div>
      </header>

      {/* Main Focus Question Container */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10 flex flex-col justify-between">
        {/* Progress Step Strip */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-purple-300">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-[#6B7399]">
              {answeredCount} / {questions.length} Answered
            </span>
          </div>

          {/* Question Nav Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {questions.map((q, idx) => {
              const isAnswered = answers[q._id] !== undefined;
              const isCurrent = currentIndex === idx;
              const isFlagged = flagged[q._id];

              return (
                <button
                  key={q._id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-9 h-9 rounded-xl font-mono text-xs font-bold transition-all relative cursor-pointer ${
                    isCurrent
                      ? 'bg-purple-600 text-white ring-2 ring-purple-400/50 shadow-md'
                      : isAnswered
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'bg-white/5 text-[#6B7399] border border-surface-border'
                  }`}
                >
                  {idx + 1}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Current Question Card */}
          {currentQ && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ._id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="mt-6 rounded-3xl glass-panel p-6 sm:p-8 border border-surface-border space-y-6 bg-bg-1/80"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
                      {currentQ.type} &bull; {currentQ.points || 10} Points
                    </span>
                    <h3 className="font-display font-bold text-lg sm:text-xl text-white leading-relaxed">
                      {currentQ.prompt}
                    </h3>
                  </div>

                  <button
                    onClick={() => toggleFlag(currentQ._id)}
                    title="Flag for review (F)"
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      flagged[currentQ._id]
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : 'glass-panel text-[#6B7399] hover:text-white'
                    }`}
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </div>

                {/* Option Cards */}
                <div className="space-y-3 pt-2">
                  {currentQ.options?.map((opt, optIdx) => {
                    const isSelected = answers[currentQ._id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(currentQ._id, opt.id)}
                        className={`w-full p-4 rounded-2xl border text-left text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-purple-600/20 border-purple-400 text-white ring-1 ring-purple-400 shadow-lg shadow-purple-950/40'
                            : 'glass-panel bg-white/5 border-surface-border text-[#A9B1D6] hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-white/5 border border-surface-border flex items-center justify-center font-mono text-xs text-[#6B7399]">
                            {optIdx + 1}
                          </span>
                          <span>{opt.text}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="pt-8 flex items-center justify-between border-t border-surface-border/60">
          <Button
            variant="secondary"
            size="md"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          {currentIndex < questions.length - 1 ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Next Question
            </Button>
          ) : (
            <Button
              variant="cta"
              size="md"
              onClick={() => setIsSubmitDialogOpen(true)}
              icon={<Sparkles className="w-4 h-4" />}
            >
              Submit Assessment
            </Button>
          )}
        </div>
      </main>

      {/* Confirm Submission Dialog Modal */}
      <Dialog
        isOpen={isSubmitDialogOpen}
        onClose={() => setIsSubmitDialogOpen(false)}
        title="Submit Graded Assessment?"
        description="Your responses will be graded server-side against the interview master rubric."
      >
        <div className="space-y-4 text-sm text-[#A9B1D6]">
          {unansweredCount > 0 ? (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>
                You have <strong>{unansweredCount} unanswered questions</strong>.
              </span>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>All {questions.length} questions answered!</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setIsSubmitDialogOpen(false)}>
              Keep Working
            </Button>
            <Button
              variant="cta"
              size="sm"
              loading={submitMutation.isPending}
              onClick={handleSubmitQuiz}
            >
              Confirm &amp; Grade
            </Button>
          </div>
        </div>
      </Dialog>
    </PageTransition>
  );
};
