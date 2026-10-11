import React, { useState } from 'react';
import {
  Printer,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
  Sparkles,
} from 'lucide-react';
import { Button } from '../ui/Button';

export interface CheatSheetSection {
  title: string;
  theme?: string;
  items?: string[];
  table?: {
    headers: string[];
    rows: string[][];
  };
  keyTakeaway?: string;
}

export interface CheatSheetData {
  title: string;
  conceptCode: string;
  sections: CheatSheetSection[];
}

interface CheatSheetViewerProps {
  data: CheatSheetData;
  className?: string;
}

export const CheatSheetViewer: React.FC<CheatSheetViewerProps> = ({ data, className }) => {
  const [zoom, setZoom] = useState(1);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cheatsheet_${data.conceptCode.toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl glass-panel border border-surface-border print:hidden">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span className="font-display font-bold text-sm text-white">
            {data.conceptCode}: {data.title}
          </span>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            1-Page Revision Sheet
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 border-r border-surface-border pr-2">
            <button
              onClick={() => setZoom((z) => Math.max(0.8, z - 0.1))}
              className="p-1.5 rounded-lg text-[#A9B1D6] hover:text-white hover:bg-white/10 cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-[#6B7399] w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
              className="p-1.5 rounded-lg text-[#A9B1D6] hover:text-white hover:bg-white/10 cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownloadJson}
            icon={<Download className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            Export JSON
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            icon={<Printer className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            Print / PDF
          </Button>
        </div>
      </div>

      {/* Styled Printable Cheat Sheet Document */}
      <div
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
        className="transition-transform duration-200"
      >
        <div className="rounded-3xl glass-panel p-8 sm:p-10 border border-surface-border bg-bg-1/95 space-y-8 shadow-2xl print:bg-white print:text-black print:border-none print:p-0">
          {/* Header */}
          <div className="border-b border-surface-border pb-6 flex items-start justify-between">
            <div className="space-y-1">
              <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider print:text-blue-700">
                CSF Livebook Master Curriculum &bull; Concept {data.conceptCode}
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white print:text-black">
                {data.title}
              </h2>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-xs font-mono text-purple-300 print:text-purple-700 block">
                Technical Interview Matrix
              </span>
              <span className="text-[11px] text-[#6B7399] font-mono print:text-gray-600">
                Generated &bull; Verified
              </span>
            </div>
          </div>

          {/* Color-Coded Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(data?.sections || []).map((sec, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl glass-panel bg-white/5 border border-surface-border/80 space-y-3.5 print:bg-gray-50 print:border-gray-200"
              >
                <div className="flex items-center gap-2 border-b border-surface-border pb-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 print:bg-blue-600" />
                  <h3 className="font-display font-bold text-sm text-white print:text-black">
                    {sec.title}
                  </h3>
                </div>

                {/* Items */}
                {sec.items && (
                  <ul className="space-y-2 text-xs text-[#A9B1D6] print:text-gray-800">
                    {(sec.items || []).map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0 print:bg-purple-600" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Table if present */}
                {sec.table && (
                  <div className="overflow-x-auto pt-1">
                    <table className="w-full text-left text-[11px] font-mono">
                      <thead className="text-[#A9B1D6] border-b border-surface-border">
                        <tr>
                          {(sec.table.headers || []).map((h, i) => (
                            <th key={i} className="pb-1 font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-border/50 text-[#F5F7FF] print:text-gray-900">
                        {(sec.table.rows || []).map((row, rIdx) => (
                          <tr key={rIdx}>
                            {(row || []).map((cell, cIdx) => (
                              <td key={cIdx} className="py-1.5 pr-2">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Key Takeaway Callout */}
                {sec.keyTakeaway && (
                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-200 leading-relaxed font-mono print:bg-purple-50 print:text-purple-900">
                    <strong>Notice:</strong> {sec.keyTakeaway}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="pt-4 border-t border-surface-border text-center text-xs font-mono text-[#6B7399] print:text-gray-500">
            CSF Livebook &copy; {new Date().getFullYear()} &bull; Master CS Fundamentals Interview Revision
          </div>
        </div>
      </div>
    </div>
  );
};
