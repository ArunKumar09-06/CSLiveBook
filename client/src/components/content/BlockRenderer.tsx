import React from 'react';
import { HeadingBlock, HeadingBlockData } from './HeadingBlock';
import { TextBlock, TextBlockData } from './TextBlock';
import { CalloutBlock, CalloutBlockData } from './CalloutBlock';
import { CodeBlock, CodeBlockData } from './CodeBlock';
import { ComparisonBlock, ComparisonBlockData } from './ComparisonBlock';
import { MisconceptionBlock, MisconceptionBlockData } from './MisconceptionBlock';
import { UnderstandingCheckBlock, UnderstandingCheckBlockData } from './UnderstandingCheckBlock';
import { InterviewQuestionBlock, InterviewQuestionBlockData } from './InterviewQuestionBlock';
import { RecapBlock, RecapBlockData } from './RecapBlock';
import { TableBlock, TableBlockData } from './TableBlock';
import { DiagramRenderer, DiagramBlockData } from '../diagrams/DiagramRenderer';

// Union of all supported block types
export type ContentBlock =
  | HeadingBlockData
  | TextBlockData
  | CalloutBlockData
  | CodeBlockData
  | ComparisonBlockData
  | MisconceptionBlockData
  | UnderstandingCheckBlockData
  | InterviewQuestionBlockData
  | RecapBlockData
  | TableBlockData
  | DiagramBlockData
  | { type: string; id?: string; [key: string]: unknown };

export const BlockRenderer: React.FC<{ block: ContentBlock }> = ({ block }) => {
  switch (block.type) {
    case 'heading':
      return <HeadingBlock block={block as HeadingBlockData} />;
    case 'text':
      return <TextBlock block={block as TextBlockData} />;
    case 'callout':
      return <CalloutBlock block={block as CalloutBlockData} />;
    case 'warning':
      return (
        <CalloutBlock
          block={{
            type: 'callout',
            variant: 'warning',
            title: 'Warning',
            text: (block as unknown as { text: string }).text || '',
          }}
        />
      );
    case 'code':
      return <CodeBlock block={block as CodeBlockData} />;
    case 'comparison':
      return <ComparisonBlock block={block as ComparisonBlockData} />;
    case 'misconception':
      return <MisconceptionBlock block={block as MisconceptionBlockData} />;
    case 'understanding_check':
      return <UnderstandingCheckBlock block={block as UnderstandingCheckBlockData} />;
    case 'interview_question':
      return <InterviewQuestionBlock block={block as InterviewQuestionBlockData} />;
    case 'recap':
      return <RecapBlock block={block as RecapBlockData} />;
    case 'table':
      return <TableBlock block={block as TableBlockData} />;
    case 'diagram':
    case 'flowchart':
      return <DiagramRenderer block={block as DiagramBlockData} />;
    default:
      return null;
  }
};
