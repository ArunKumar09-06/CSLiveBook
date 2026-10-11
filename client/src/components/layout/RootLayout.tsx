import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Lenis from 'lenis';
import { Toaster } from 'sonner';
import { Navbar } from '../navigation/Navbar';
import { Footer } from '../navigation/Footer';
import { OfflineIndicator } from './OfflineIndicator';
import { useThemeStore } from '../../stores/themeStore';

export const RootLayout: React.FC = () => {
  const { theme } = useThemeStore();

  useEffect(() => {
    // Lenis smooth scrolling initialization
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className={`relative min-h-screen flex flex-col bg-bg-0 text-[#F5F7FF] transition-colors duration-300 ${theme}`}>
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Ambient Aurora Glow Blobs */}
      <div className="fixed top-[-15%] left-[-10%] w-[550px] h-[550px] rounded-full bg-purple-600/15 blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-[25%] right-[-10%] w-[650px] h-[650px] rounded-full bg-cyan-600/10 blur-[160px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-15%] left-[25%] w-[600px] h-[600px] rounded-full bg-indigo-600/12 blur-[150px] pointer-events-none -z-10" />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Offline Status Detector */}
      <OfflineIndicator />

      {/* Sonner Toast Notification Center */}
      <Toaster
        theme={theme === 'dark' ? 'dark' : 'light'}
        position="bottom-right"
        toastOptions={{
          className: 'glass-panel border-surface-border text-white',
          duration: 3500,
        }}
      />
    </div>
  );
};
