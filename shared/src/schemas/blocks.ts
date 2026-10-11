import { z } from 'zod';

export const HeadingBlockSchema = z.object({
  id: z.string(),
  type: z.literal('heading'),
  level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  text: z.string(),
});

export const TextBlockSchema = z.object({
  id: z.string(),
  type: z.literal('text'),
  content: z.string(),
});

export const CalloutBlockSchema = z.object({
  id: z.string(),
  type: z.literal('callout'),
  variant: z.enum(['info', 'tip', 'warning', 'danger', 'note']),
  title: z.string().optional(),
  content: z.string(),
});

export const TableBlockSchema = z.object({
  id: z.string(),
  type: z.literal('table'),
  headers: z.array(z.string()),
  rows: z.array(z.array(z.string())),
  caption: z.string().optional(),
});

export const DiagramStepSchema = z.object({
  stepNumber: z.number(),
  label: z.string(),
  description: z.string(),
});

export const DiagramBlockSchema = z.object({
  id: z.string(),
  type: z.literal('diagram'),
  visualKey: z.string(), // e.g. VB-1, VB-2
  title: z.string(),
  caption: z.string().optional(),
  whatToNotice: z.array(z.string()).optional(),
  steps: z.array(DiagramStepSchema).optional(),
  has3D: z.boolean().default(false),
});

export const FlowchartBlockSchema = z.object({
  id: z.string(),
  type: z.literal('flowchart'),
  title: z.string(),
  nodes: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      shape: z.enum(['box', 'diamond', 'circle', 'cylinder']).optional(),
    })
  ),
  edges: z.array(
    z.object({
      from: z.string(),
      to: z.string(),
      label: z.string().optional(),
    })
  ),
  caption: z.string().optional(),
});

export const ExampleBlockSchema = z.object({
  id: z.string(),
  type: z.literal('example'),
  title: z.string(),
  scenario: z.string(),
  solution: z.string(),
  language: z.string().optional(),
});

export const CodeBlockSchema = z.object({
  id: z.string(),
  type: z.literal('code'),
  code: z.string(),
  language: z.string(),
  title: z.string().optional(),
  highlightLines: z.array(z.number()).optional(),
  copyable: z.boolean().default(true),
});

export const ComparisonCriterionSchema = z.object({
  name: z.string(),
  left: z.string(),
  right: z.string(),
});

export const ComparisonBlockSchema = z.object({
  id: z.string(),
  type: z.literal('comparison'),
  title: z.string().optional(),
  leftTitle: z.string(),
  rightTitle: z.string(),
  criteria: z.array(ComparisonCriterionSchema),
});

export const MisconceptionBlockSchema = z.object({
  id: z.string(),
  type: z.literal('misconception'),
  myth: z.string(),
  reality: z.string(),
  explanation: z.string(),
});

export const WarningBlockSchema = z.object({
  id: z.string(),
  type: z.literal('warning'),
  title: z.string(),
  message: z.string(),
});

export const UnderstandingCheckOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
});

export const UnderstandingCheckBlockSchema = z.object({
  id: z.string(),
  type: z.literal('understanding_check'),
  question: z.string(),
  options: z.array(UnderstandingCheckOptionSchema),
  correctOptionId: z.string(),
  explanation: z.string(),
});

export const InterviewFollowUpSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const InterviewQuestionBlockSchema = z.object({
  id: z.string(),
  type: z.literal('interview_question'),
  question: z.string(),
  frequency: z.enum(['HIGH', 'MEDIUM', 'VERY_HIGH']).optional(),
  modelAnswer: z.string(),
  followUps: z.array(InterviewFollowUpSchema).optional(),
});

export const QuizBlockSchema = z.object({
  id: z.string(),
  type: z.literal('quiz'),
  assessmentId: z.string().optional(),
  title: z.string(),
  questionCount: z.number().optional(),
  passingScore: z.number().optional(),
});

export const CheatSheetBlockSchema = z.object({
  id: z.string(),
  type: z.literal('cheat_sheet'),
  title: z.string(),
  resourceId: z.string().optional(),
  summaryPoints: z.array(z.string()).optional(),
});

export const RecapBlockSchema = z.object({
  id: z.string(),
  type: z.literal('recap'),
  title: z.string().default('If you remember only 5 things'),
  keyPoints: z.array(z.string()),
});

export const ImageBlockSchema = z.object({
  id: z.string(),
  type: z.literal('image'),
  url: z.string().url(),
  alt: z.string(),
  caption: z.string().optional(),
});

export const VideoBlockSchema = z.object({
  id: z.string(),
  type: z.literal('video'),
  url: z.string(),
  title: z.string().optional(),
  duration: z.number().optional(),
});

export const ContentBlockSchema = z.discriminatedUnion('type', [
  HeadingBlockSchema,
  TextBlockSchema,
  CalloutBlockSchema,
  TableBlockSchema,
  DiagramBlockSchema,
  FlowchartBlockSchema,
  ExampleBlockSchema,
  CodeBlockSchema,
  ComparisonBlockSchema,
  MisconceptionBlockSchema,
  WarningBlockSchema,
  UnderstandingCheckBlockSchema,
  InterviewQuestionBlockSchema,
  QuizBlockSchema,
  CheatSheetBlockSchema,
  RecapBlockSchema,
  ImageBlockSchema,
  VideoBlockSchema,
]);

export type ContentBlock = z.infer<typeof ContentBlockSchema>;
export type HeadingBlock = z.infer<typeof HeadingBlockSchema>;
export type TextBlock = z.infer<typeof TextBlockSchema>;
export type CalloutBlock = z.infer<typeof CalloutBlockSchema>;
export type TableBlock = z.infer<typeof TableBlockSchema>;
export type DiagramBlock = z.infer<typeof DiagramBlockSchema>;
export type FlowchartBlock = z.infer<typeof FlowchartBlockSchema>;
export type ExampleBlock = z.infer<typeof ExampleBlockSchema>;
export type CodeBlock = z.infer<typeof CodeBlockSchema>;
export type ComparisonBlock = z.infer<typeof ComparisonBlockSchema>;
export type MisconceptionBlock = z.infer<typeof MisconceptionBlockSchema>;
export type WarningBlock = z.infer<typeof WarningBlockSchema>;
export type UnderstandingCheckBlock = z.infer<typeof UnderstandingCheckBlockSchema>;
export type InterviewQuestionBlock = z.infer<typeof InterviewQuestionBlockSchema>;
export type QuizBlock = z.infer<typeof QuizBlockSchema>;
export type CheatSheetBlock = z.infer<typeof CheatSheetBlockSchema>;
export type RecapBlock = z.infer<typeof RecapBlockSchema>;
export type ImageBlock = z.infer<typeof ImageBlockSchema>;
export type VideoBlock = z.infer<typeof VideoBlockSchema>;
