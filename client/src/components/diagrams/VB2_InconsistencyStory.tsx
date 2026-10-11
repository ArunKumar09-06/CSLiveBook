import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ArrowRight, RotateCcw, Check, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export const VB2_InconsistencyStory: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      step: 1,
      title: 'Step 1: Sam Updates Contact Details at Registrar',
      description:
        'Student Sam walks into the Registrar office and changes his phone number to +1-555-0199. The Registrar software updates registrar.txt.',
      status: 'Registrar file updated successfully.',
      state: {
        registrar: '+1-555-0199 (Fresh)',
        hostel: '+1-555-0100 (Stale)',
        library: '+1-555-0100 (Stale)',
      },
    },
    {
      step: 2,
      title: 'Step 2: Hostel & Library Files Remain Unsynchronized',
      description:
        'Because files are isolated with no inter-file replication protocol, hostel.txt and library.txt retain Sam\'s old phone number.',
      status: 'Data Inconsistency is born.',
      state: {
        registrar: '+1-555-0199 (Fresh)',
        hostel: '+1-555-0100 (Stale!)',
        library: '+1-555-0100 (Stale!)',
      },
    },
    {
      step: 3,
      title: 'Step 3: Annual Report Generates Conflicting Records',
      description:
        'The University campus emergency alert system queries both files and sends critical messages to the wrong number. An audit flags conflicting student records.',
      status: 'Integrity Failure: Which number is the real Sam?',
      state: {
        registrar: 'Conflict Detected',
        hostel: 'Conflict Detected',
        library: 'Audit Failure',
      },
    },
  ];

  const active = steps[currentStep - 1];

  return (
    <div className="rounded-2xl glass-panel p-5 sm:p-6 border border-surface-border my-8 space-y-5">
      {/* Header with Step Scrubber */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-surface-border">
        <div>
          <span className="text-xs font-mono text-purple-400 font-semibold uppercase tracking-wider block">
            Visual Register: VB-2 (Interactive Process Story)
          </span>
          <h4 className="font-display font-bold text-base text-white">
            The Three-Step Inconsistency Catastrophe
          </h4>
        </div>

        {/* Scrubber step buttons */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              onClick={() => setCurrentStep(s)}
              className={`w-8 h-8 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                currentStep === s
                  ? 'bg-purple-600 text-white ring-2 ring-purple-400/50 shadow-md'
                  : 'bg-white/5 text-[#A9B1D6] hover:bg-white/10'
              }`}
            >
              0{s}
            </button>
          ))}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentStep((prev) => (prev < 3 ? prev + 1 : 1))}
            className="text-xs ml-2"
          >
            {currentStep < 3 ? 'Next Step &rarr;' : 'Restart Story'}
          </Button>
        </div>
      </div>

      {/* Animated Story Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <h5 className="font-display font-bold text-sm text-purple-200 mb-1">
              {active.title}
            </h5>
            <p className="text-xs sm:text-sm text-[#A9B1D6] leading-relaxed">
              {active.description}
            </p>
          </div>

          {/* Visual File State Inspection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl glass-panel border border-surface-border space-y-1">
              <span className="text-[11px] font-mono text-[#6B7399] uppercase block">
                registrar.txt
              </span>
              <div
                className={`font-mono text-xs font-bold ${
                  currentStep === 1 ? 'text-emerald-400' : currentStep === 3 ? 'text-rose-400' : 'text-white'
                }`}
              >
                {active.state.registrar}
              </div>
            </div>

            <div className="p-3.5 rounded-xl glass-panel border border-surface-border space-y-1">
              <span className="text-[11px] font-mono text-[#6B7399] uppercase block">
                hostel.txt
              </span>
              <div
                className={`font-mono text-xs font-bold ${
                  currentStep >= 2 ? 'text-rose-400' : 'text-white'
                }`}
              >
                {active.state.hostel}
              </div>
            </div>

            <div className="p-3.5 rounded-xl glass-panel border border-surface-border space-y-1">
              <span className="text-[11px] font-mono text-[#6B7399] uppercase block">
                library.txt
              </span>
              <div
                className={`font-mono text-xs font-bold ${
                  currentStep >= 2 ? 'text-rose-400' : 'text-white'
                }`}
              >
                {active.state.library}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* "What to notice" Footer */}
      <div className="p-3.5 rounded-xl bg-white/5 border border-surface-border text-xs text-[#A9B1D6] space-y-1">
        <span className="font-mono text-cyan-300 font-semibold uppercase tracking-wider block text-[11px]">
          Why DBMS Eliminates This:
        </span>
        <div>&bull; Relational Normalization ensures student phone number is stored in exactly <strong>one row</strong> in the <code>students</code> table.</div>
        <div>&bull; Both Registrar, Hostel, and Library query the single canonical row via primary key <code>student_id</code>.</div>
      </div>
    </div>
  );
};
