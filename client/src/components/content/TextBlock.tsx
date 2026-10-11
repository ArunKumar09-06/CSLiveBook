import React from 'react';
import ReactMarkdown from 'react-markdown';

export interface TextBlockData {
  type: 'text';
  id?: string;
  markdown: string;
}

export const TextBlock: React.FC<{ block: TextBlockData }> = ({ block }) => {
  return (
    <div
      id={block.id}
      className="prose prose-invert max-w-none text-sm sm:text-base text-[#F5F7FF] leading-relaxed my-5 space-y-4 font-sans"
    >
      <ReactMarkdown>{block.markdown}</ReactMarkdown>
    </div>
  );
};
