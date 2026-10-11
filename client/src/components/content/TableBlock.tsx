import React from 'react';

export interface TableBlockData {
  type: 'table';
  id?: string;
  caption?: string;
  headers?: string[];
  rows?: string[][];
}

export const TableBlock: React.FC<{ block: TableBlockData }> = ({ block }) => {
  const headers = block.headers || [];
  const rows = block.rows || [];

  return (
    <div id={block.id} className="my-8 rounded-2xl glass-panel border border-surface-border overflow-hidden">
      {block.caption && (
        <div className="px-5 py-3 bg-white/5 border-b border-surface-border text-xs font-mono text-[#A9B1D6]">
          {block.caption}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          {headers.length > 0 && (
            <thead className="bg-white/5 border-b border-surface-border text-xs font-mono uppercase tracking-wider text-purple-300">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-surface-border/50 text-[#F5F7FF]">
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-white/5 transition-colors">
                {(row || []).map((cell, cIdx) => (
                  <td key={cIdx} className="px-4 py-3 leading-relaxed">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
