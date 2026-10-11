import React from 'react';
import { VB1_ThreeOffices } from './VB1_ThreeOffices';
import { VB2_InconsistencyStory } from './VB2_InconsistencyStory';

export interface DiagramBlockData {
  type: 'diagram';
  id?: string;
  visualKey: string;
  caption?: string;
}

export const DiagramRenderer: React.FC<{ block: DiagramBlockData }> = ({ block }) => {
  const key = block.visualKey.toUpperCase();

  switch (key) {
    case 'VB-1':
    case 'VB1':
      return <VB1_ThreeOffices />;
    case 'VB-2':
    case 'VB2':
      return <VB2_InconsistencyStory />;
    default:
      return (
        <div id={block.id} className="p-6 rounded-2xl glass-panel border border-surface-border my-6 text-center space-y-2">
          <span className="text-xs font-mono text-cyan-400">Diagram: {block.visualKey}</span>
          <p className="text-xs text-[#A9B1D6]">
            {block.caption || 'Interactive Architecture Diagram'}
          </p>
        </div>
      );
  }
};
