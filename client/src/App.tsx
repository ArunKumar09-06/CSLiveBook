import React from 'react';

export default function App() {
  return (
    <div className="relative min-h-screen bg-bg-0 text-[#F5F7FF] flex flex-col justify-between overflow-hidden">
      <div className="noise-overlay" />

      {/* Aurora Ambient Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[130px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-600/15 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[25%] w-[600px] h-[600px] rounded-full bg-indigo-600/15 blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full border-b border-surface-border bg-bg-1/60 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center font-display font-bold text-lg shadow-lg shadow-purple-500/25">
            CSF
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white">
            CSF <span className="aurora-text">Livebook</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
            Phase 1 Foundation Active
          </div>
        </div>
      </header>

      {/* Hero Body */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-16 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-xs text-purple-300 mb-6 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          The Computer Science Fundamentals Interview Master Curriculum
        </div>

        <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Crack CS Fundamentals Interviews,{' '}
          <span className="aurora-text">Concept by Concept.</span>
        </h1>

        <p className="text-lg text-[#A9B1D6] max-w-2xl mb-10 leading-relaxed">
          Production-grade, interactive learning platform covering 8 subjects, 42 modules, and 184 high-priority interview concepts with rich blocks, 3D diagrams, and server-side assessment.
        </p>

        {/* Metric Badges */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-xl mb-10">
          <div className="glass-panel p-4 rounded-2xl">
            <div className="font-display text-3xl font-bold text-white">8</div>
            <div className="text-xs text-[#A9B1D6] uppercase tracking-wider font-mono mt-1">Subjects</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl">
            <div className="font-display text-3xl font-bold text-cyan-400">42</div>
            <div className="text-xs text-[#A9B1D6] uppercase tracking-wider font-mono mt-1">Modules</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl">
            <div className="font-display text-3xl font-bold text-purple-400">184</div>
            <div className="text-xs text-[#A9B1D6] uppercase tracking-wider font-mono mt-1">Concepts</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button className="cta-button px-8 py-3.5 rounded-xl font-semibold text-white cursor-pointer">
            Explore Curriculum
          </button>
          <a
            href="http://localhost:4000/health"
            target="_blank"
            rel="noreferrer"
            className="glass-panel px-6 py-3.5 rounded-xl font-medium text-[#F5F7FF] hover:bg-white/10 transition-colors"
          >
            API Health Check ↗
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-surface-border bg-bg-1/40 py-6 text-center text-xs text-[#6B7399] font-mono">
        CSF Livebook &copy; 2026 &bull; MERN Architecture with Strict TypeScript &bull; MongoDB + Express + React + Node
      </footer>
    </div>
  );
}
