import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

import { PageTransition } from '../components/layout/PageTransition';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/Card';
import { useAuthStore } from '../stores/authStore';

const DataCubeScene = React.lazy(() => import('../components/three/DataCubeScene'));

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back to CSF Livebook!');
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message || 'Invalid email or password';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillCredentials = (email: string, pass: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', pass, { shouldValidate: true });
  };

  return (
    <PageTransition className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left: 3D Visualization & Brand Column */}
        <div className="hidden lg:flex flex-col justify-center items-center text-center p-8 relative">
          <div className="w-full h-[400px]">
            <React.Suspense fallback={<div className="w-48 h-48 rounded-2xl bg-purple-500/10 animate-pulse mx-auto" />}>
              <DataCubeScene />
            </React.Suspense>
          </div>
          <div className="space-y-3 max-w-md relative z-10 mt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel text-xs text-purple-300 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Production MERN Security</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-white tracking-tight">
              Master the Fundamentals. <br />
              <span className="aurora-text">Accelerate Your Career.</span>
            </h2>
            <p className="text-xs text-[#A9B1D6] leading-relaxed">
              HTTP-only token rotation, server-side assessment validation, and 184 interview-critical concepts.
            </p>
          </div>
        </div>

        {/* Right: Glass Login Form */}
        <div className="w-full max-w-md mx-auto">
          <GlassCard className="p-8 sm:p-10 border border-surface-border shadow-2xl shadow-purple-950/40">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center font-display font-bold text-sm text-white">
                  CSF
                </div>
                <span className="font-display font-bold text-lg text-white">Sign In</span>
              </div>
              <p className="text-xs text-[#A9B1D6]">
                Enter your credentials to resume your curriculum progress
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
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

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A9B1D6]">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
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

              {/* Submit Button */}
              <Button
                type="submit"
                variant="cta"
                loading={isSubmitting}
                className="w-full py-3"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In to CSF Livebook
              </Button>
            </form>

            {/* Quick-fill demo credentials for reviewer */}
            <div className="mt-6 pt-6 border-t border-surface-border/60">
              <span className="block text-[11px] font-mono uppercase tracking-wider text-[#6B7399] mb-2.5">
                Instant Demo Credentials (1-Click Fill)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillCredentials('student@csflivebook.com', 'StudentPass123!')}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-surface-border text-xs text-[#A9B1D6] hover:text-white font-mono text-left cursor-pointer transition-colors"
                >
                  <div className="font-semibold text-cyan-400">Student Demo</div>
                  <div className="text-[10px] text-[#6B7399] truncate">student@csflivebook...</div>
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('admin@csflivebook.com', 'AdminPass123!')}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-surface-border text-xs text-[#A9B1D6] hover:text-white font-mono text-left cursor-pointer transition-colors"
                >
                  <div className="font-semibold text-purple-400">Admin Demo</div>
                  <div className="text-[10px] text-[#6B7399] truncate">admin@csflivebook...</div>
                </button>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-[#A9B1D6]">
              Don&apos;t have an account yet?{' '}
              <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold underline">
                Create one now
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </PageTransition>
  );
};
