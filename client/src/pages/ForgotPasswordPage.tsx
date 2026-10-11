import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

import { PageTransition } from '../components/layout/PageTransition';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/Card';
import { api } from '../lib/api';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    setIsSubmitting(true);
    try {
      await api.post('/auth/forgot-password', { email: data.email });
      setSubmitted(true);
      toast.success('If that email is registered, a password reset link has been dispatched.');
    } catch {
      toast.error('Unable to process password reset request at this time.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6">
      <div className="w-full max-w-md">
        <GlassCard className="p-8 sm:p-10 border border-surface-border shadow-2xl shadow-purple-950/40">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-[#A9B1D6] hover:text-white mb-6 font-mono transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>

          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">Reset Link Sent</h3>
              <p className="text-xs text-[#A9B1D6] leading-relaxed">
                If an account matches your email address, you will receive instructions to reset your password shortly.
              </p>
              <div className="pt-2">
                <Link to="/login">
                  <Button variant="primary" size="sm">
                    Return to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-white">Reset Password</h2>
                <p className="text-xs text-[#A9B1D6] mt-1.5">
                  Enter your registered email address and we&apos;ll send you a password recovery link.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A9B1D6]">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B7399]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="student@csflivebook.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-panel bg-white/5 border border-surface-border text-sm text-white placeholder-[#6B7399] focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-colors"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-rose-400">{errors.email.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  loading={isSubmitting}
                  className="w-full py-2.5"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Send Recovery Link
                </Button>
              </form>
            </>
          )}
        </GlassCard>
      </div>
    </PageTransition>
  );
};
