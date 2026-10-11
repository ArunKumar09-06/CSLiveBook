import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, Sparkles, Check, X } from 'lucide-react';

import { PageTransition } from '../components/layout/PageTransition';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/Card';
import { useAuthStore } from '../stores/authStore';

const DataCubeScene = React.lazy(() => import('../components/three/DataCubeScene'));

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
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

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const passwordValue = watch('password', '');

  // Password Strength Evaluation
  const strengthChecks = [
    { label: 'At least 8 characters', valid: passwordValue.length >= 8 },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(passwordValue) },
    { label: 'One lowercase letter', valid: /[a-z]/.test(passwordValue) },
    { label: 'One numeric digit', valid: /[0-9]/.test(passwordValue) },
  ];
  const passedCount = strengthChecks.filter((c) => c.valid).length;
  const strengthColors = ['bg-rose-500', 'bg-orange-500', 'bg-amber-500', 'bg-emerald-500'];
  const strengthText = ['Weak', 'Fair', 'Good', 'Strong'];

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      await registerUser(data.name, data.email, data.password);
      toast.success('Registration successful! Welcome to CSF Livebook.');
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message || 'Failed to register account';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left: 3D Visualization */}
        <div className="hidden lg:flex flex-col justify-center items-center text-center p-8 relative">
          <div className="w-full h-[400px]">
            <React.Suspense fallback={<div className="w-48 h-48 rounded-2xl bg-purple-500/10 animate-pulse mx-auto" />}>
              <DataCubeScene />
            </React.Suspense>
          </div>
          <div className="space-y-3 max-w-md relative z-10 mt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel text-xs text-purple-300 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full Curriculum Access</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-white tracking-tight">
              Start Your Preparation. <br />
              <span className="aurora-text">Track Real Progress.</span>
            </h2>
            <p className="text-xs text-[#A9B1D6] leading-relaxed">
              Earn XP, build daily streaks, test your retention with server-graded quizzes, and master all 8 CS subjects.
            </p>
          </div>
        </div>

        {/* Right: Glass Register Form */}
        <div className="w-full max-w-md mx-auto">
          <GlassCard className="p-8 sm:p-10 border border-surface-border shadow-2xl shadow-purple-950/40">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center font-display font-bold text-sm text-white">
                  CSF
                </div>
                <span className="font-display font-bold text-lg text-white">Create Account</span>
              </div>
              <p className="text-xs text-[#A9B1D6]">
                Join CSF Livebook to prepare for high-stakes technical interviews
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A9B1D6]">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B7399]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    {...register('name')}
                    placeholder="Alex Morgan"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-panel bg-white/5 border border-surface-border text-sm text-white placeholder-[#6B7399] focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-colors"
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-rose-400">{errors.name.message}</p>
                )}
              </div>

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
                    placeholder="alex@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-panel bg-white/5 border border-surface-border text-sm text-white placeholder-[#6B7399] focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-colors"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-rose-400">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A9B1D6]">
                  Password
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

              {/* Live Password Strength Meter */}
              {passwordValue && (
                <div className="p-3 rounded-xl bg-white/5 border border-surface-border space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6B7399]">Security Level:</span>
                    <span className="font-mono font-semibold text-white">
                      {passedCount > 0 ? strengthText[passedCount - 1] : 'Weak'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 h-1.5">
                    {[0, 1, 2, 3].map((idx) => (
                      <div
                        key={idx}
                        className={`rounded-full transition-colors ${
                          idx < passedCount ? strengthColors[passedCount - 1] : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-1 pt-1 text-[11px]">
                    {strengthChecks.map((check, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-1 ${
                          check.valid ? 'text-emerald-400' : 'text-[#6B7399]'
                        }`}
                      >
                        {check.valid ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>{check.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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

              {/* Submit */}
              <Button
                type="submit"
                variant="cta"
                loading={isSubmitting}
                className="w-full py-3 mt-2"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Create CSF Account
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-[#A9B1D6]">
              Already registered?{' '}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold underline">
                Sign in here
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </PageTransition>
  );
};
