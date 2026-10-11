import React, { useEffect, useState } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Share2,
  Flame,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

import { PageTransition } from '../components/layout/PageTransition';
import { Button } from '../components/ui/Button';
import { GlassCard, GradientBorderCard } from '../components/ui/Card';
import { ProgressRing } from '../components/ui/Progress';
import { Badge } from '../components/ui/Badge';

export const QuizResultPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();

  const result = location.state?.result;
  const concept = location.state?.concept;

  const [animatedScore, setAnimatedScore] = useState(0);

  const score = result?.score ?? 80;
  const passed = result?.passed ?? score >= 70;
  const xpEarned = result?.xpEarned || (passed ? 100 : 0);
  const questions = result?.questions || [];

  // Animated Count-Up & Celebration Confetti
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const stepTime = 20;
    const stepIncrement = Math.ceil(score / (duration / stepTime));

    const timer = setInterval(() => {
      start += stepIncrement;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
        if (passed) {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.5 },
            colors: ['#7C3AED', '#22D3EE', '#34D399', '#EC4899'],
          });
        }
      } else {
        setAnimatedScore(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score, passed]);

  return (
    <PageTransition className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* 1. Score Summary Banner */}
      <GradientBorderCard className="p-8 sm:p-10 text-center space-y-6">
        <div className="flex flex-col items-center justify-center space-y-3">
          <ProgressRing
            value={animatedScore}
            size={140}
            strokeWidth={10}
            colorTheme={passed ? 'emerald' : 'rose'}
          >
            <div className="text-center">
              <span className="font-display font-extrabold text-3xl sm:text-4xl text-white">
                {animatedScore}%
              </span>
              <span className="block text-[10px] font-mono text-[#A9B1D6] uppercase">
                Score
              </span>
            </div>
          </ProgressRing>

          <div className="pt-2 space-y-1">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              {passed ? 'Assessment Passed!' : 'Review Needed'}
            </h1>
            <p className="text-xs sm:text-sm text-[#A9B1D6] max-w-md mx-auto leading-relaxed">
              {passed
                ? 'Excellent work! You demonstrated mastery of this interview concept.'
                : 'You scored below the passing threshold (70%). Review your diagnostic weak points below and retake when ready.'}
            </p>
          </div>

          {/* XP & Streak Rewards Chip */}
          {passed && (
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs shadow-inner">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>+{xpEarned} XP Awarded</span>
              <span>&bull;</span>
              <span className="text-orange-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-orange-400" /> Streak Preserved
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link to={`/concepts/${slug || 'c1-dbms-vs-file-system'}`}>
            <Button variant="primary" icon={<BookOpen className="w-4 h-4" />}>
              Return to Concept Lesson
            </Button>
          </Link>
          <Link to={`/concepts/${slug || 'c1-dbms-vs-file-system'}/quiz`}>
            <Button variant="secondary" icon={<RotateCcw className="w-4 h-4" />}>
              Retake Assessment
            </Button>
          </Link>
        </div>
      </GradientBorderCard>

      {/* 2. Question-by-Question Review with Explanations Revealed */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <h2 className="font-display text-xl font-bold text-white tracking-tight">
            Detailed Diagnostic Review
          </h2>
          <span className="text-xs font-mono text-[#6B7399]">
            Explanations &amp; Rubric Key
          </span>
        </div>

        <div className="space-y-4">
          {questions.map((q: any, idx: number) => {
            const isCorrect = q.isCorrect;
            return (
              <GlassCard
                key={q.questionId || idx}
                className={`p-6 space-y-4 border ${
                  isCorrect ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-rose-500/30 bg-rose-950/10'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-[#6B7399] uppercase">
                      Question {idx + 1} &bull; {q.type}
                    </span>
                    <h3 className="font-display font-semibold text-base text-white">
                      {q.prompt}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </span>
                    )}
                  </div>
                </div>

                {/* Candidate Response vs Correct Answer */}
                <div className="p-3.5 rounded-xl bg-black/40 border border-surface-border text-xs font-mono space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[#A9B1D6]">Your Submission:</span>
                    <span className={isCorrect ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>
                      {JSON.stringify(q.userResponse) || '(Unanswered)'}
                    </span>
                  </div>
                  {!isCorrect && (
                    <div className="flex items-center justify-between pt-1 border-t border-white/10">
                      <span className="text-[#A9B1D6]">Expected Answer:</span>
                      <span className="text-cyan-300 font-bold">
                        {JSON.stringify(q.correctAnswer)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Explanation */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-surface-border text-xs text-[#A9B1D6] leading-relaxed">
                  <strong className="text-white block mb-1">Interviewer Explanation:</strong>
                  {q.explanation}
                </div>

                {/* Deep Link to Lesson Block if missed */}
                {!isCorrect && (
                  <div className="pt-1">
                    <Link
                      to={`/concepts/${slug}?tab=learn`}
                      className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-semibold"
                    >
                      <span>Review this topic in Lesson Blocks</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
};
