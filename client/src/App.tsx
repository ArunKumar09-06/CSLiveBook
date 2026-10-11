import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RootLayout } from './components/layout/RootLayout';
import { LandingPage } from './pages/LandingPage';
import { CurriculumPage } from './pages/CurriculumPage';
import { SubjectDetailPage } from './pages/SubjectDetailPage';
import { ConceptPage } from './pages/ConceptPage';
import { QuizRunnerPage } from './pages/QuizRunnerPage';
import { QuizResultPage } from './pages/QuizResultPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { DesignShowcasePage } from './pages/DesignShowcasePage';
import { NotFoundPage } from './pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            {/* Public Landing Page */}
            <Route index element={<LandingPage />} />

            {/* Student Dashboard */}
            <Route path="dashboard" element={<DashboardPage />} />

            {/* Curriculum Tree & Subject Roadmaps */}
            <Route path="curriculum" element={<CurriculumPage />} />
            <Route path="subjects" element={<CurriculumPage />} />
            <Route path="subjects/:slug" element={<SubjectDetailPage />} />

            {/* Master Concept Experience */}
            <Route path="concepts/:slug" element={<ConceptPage />} />

            {/* Assessment Engine: Quiz Runner & Results */}
            <Route path="concepts/:slug/quiz" element={<QuizRunnerPage />} />
            <Route path="concepts/:slug/quiz/result" element={<QuizResultPage />} />

            {/* Auth Routes with 3D DataCube Scene */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />

            {/* Design System Interactive Showcase */}
            <Route path="design" element={<DesignShowcasePage />} />
            <Route path="design-system" element={<Navigate to="/design" replace />} />

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
