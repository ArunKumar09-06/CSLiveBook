import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';

import { PageTransition } from '../components/layout/PageTransition';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/Card';
import { api } from '../lib/api';

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetFormData = z.infer<typeof resetSchema>;

export const ResetPasswordPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetDone, setIsResetDone] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormData) => {
    if (!token) {
      toast.error('Missing or invalid reset token. Please request a new link.');
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword: data.password,
      });
      setIsResetDone(true);
      toast.success('Password updated successfully! You can now sign in.');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message || 'Invalid or expired reset token.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6">
      <div className="w-full max-w-md">
        <GlassCard className="p-8 sm:p-10 border border-surface-border shadow-2xl shadow-purple-950/40">
          {isResetDone ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">Password Updated</h3>
              <p className="text-xs text-[#A9B1D6] leading-relaxed">
                Your account password has been updated. You can now sign in with your new credentials.
              </p>
              <div className="pt-2">
                <Button variant="cta" size="sm" onClick={() => navigate('/login')}>
                  Go to Sign In
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-white">Choose New Password</h2>
                <p className="text-xs text-[#A9B1D6] mt-1.5">
                  Enter and confirm your new secure password.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A9B1D6]">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B7399]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl glass-panel bg-white/5 border border-surface-border text-sm text-white placeholder-[#6B7399] focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6B7399] hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-rose-400">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A9B1D6]">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B7399]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('confirmPassword')}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-panel bg-white/5 border border-surface-border text-sm text-white placeholder-[#6B7399] focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-colors"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-rose-400">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  loading={isSubmitting}
                  className="w-full py-2.5 mt-2"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Set New Password
                </Button>
              </form>
            </>
          )}
        </GlassCard>
      </div>
    </PageTransition>
  );
};
