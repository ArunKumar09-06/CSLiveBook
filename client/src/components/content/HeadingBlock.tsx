import React from 'react';
import { Hash } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface HeadingBlockData {
  type: 'heading';
  id?: string;
  level: 1 | 2 | 3 | 4;
  text: string;
}

export const HeadingBlock: React.FC<{ block: HeadingBlockData }> = ({ block }) => {
  const anchorLink = block.id ? (
    <a
      href={`#${block.id}`}
      aria-label="Anchor link"
      className="opacity-0 group-hover:opacity-100 transition-opacity text-[#6B7399] hover:text-cyan-400"
    >
      <Hash className="w-4 h-4" />
    </a>
  ) : null;

  switch (block.level) {
    case 1:
      return (
        <div id={block.id} className="group relative scroll-mt-24">
          <h1 className="font-display tracking-tight flex items-center gap-2 text-2xl sm:text-3xl font-extrabold mt-10 mb-4 pb-2 border-b border-surface-border text-white">
            <span>{block.text}</span>
            {anchorLink}
          </h1>
        </div>
      );
    case 2:
      return (
        <div id={block.id} className="group relative scroll-mt-24">
          <h2 className="font-display tracking-tight flex items-center gap-2 text-xl sm:text-2xl font-bold mt-8 mb-3 text-white">
            <span>{block.text}</span>
            {anchorLink}
          </h2>
        </div>
      );
    case 3:
      return (
        <div id={block.id} className="group relative scroll-mt-24">
          <h3 className="font-display tracking-tight flex items-center gap-2 text-lg sm:text-xl font-bold mt-6 mb-2 text-purple-200">
            <span>{block.text}</span>
            {anchorLink}
          </h3>
        </div>
      );
    case 4:
      return (
        <div id={block.id} className="group relative scroll-mt-24">
          <h4 className="font-display tracking-tight flex items-center gap-2 text-base sm:text-lg font-semibold mt-4 mb-2 text-cyan-200">
            <span>{block.text}</span>
            {anchorLink}
          </h4>
        </div>
      );
    default:
      return (
        <div id={block.id} className="group relative scroll-mt-24">
          <h2 className="font-display tracking-tight flex items-center gap-2 text-xl sm:text-2xl font-bold mt-8 mb-3 text-white">
            <span>{block.text}</span>
            {anchorLink}
          </h2>
        </div>
      );
  }
};
