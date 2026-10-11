export const Roles = ['STUDENT', 'ADMIN', 'INSTRUCTOR'] as const;
export type Role = (typeof Roles)[number];

export const Difficulties = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;
export type Difficulty = (typeof Difficulties)[number];

export const ConceptStatuses = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'] as const;
export type ConceptStatus = (typeof ConceptStatuses)[number];

export const AssessmentTypes = ['CONCEPT_QUIZ', 'MODULE_ASSESSMENT'] as const;
export type AssessmentType = (typeof AssessmentTypes)[number];

export const AttemptStatuses = [
  'IN_PROGRESS',
  'SUBMITTED',
  'EVALUATED',
  'PENDING_MANUAL_REVIEW',
] as const;
export type AttemptStatus = (typeof AttemptStatuses)[number];

export const QuestionTypes = [
  'MCQ',
  'MATCHING',
  'SHORT_ANSWER',
  'SCENARIO',
  'OUTPUT_PREDICTION',
  'MISCONCEPTION_DETECTION',
  'COMPARISON',
] as const;
export type QuestionType = (typeof QuestionTypes)[number];

export const ResourceTypes = ['VIDEO', 'CHEAT_SHEET'] as const;
export type ResourceType = (typeof ResourceTypes)[number];

export const ResourceSources = ['UPLOAD', 'URL', 'MARKDOWN', 'JSON_BLOCKS'] as const;
export type ResourceSource = (typeof ResourceSources)[number];

export const BlockTypes = [
  'heading',
  'text',
  'callout',
  'table',
  'diagram',
  'flowchart',
  'example',
  'code',
  'comparison',
  'misconception',
  'warning',
  'understanding_check',
  'interview_question',
  'quiz',
  'cheat_sheet',
  'recap',
  'image',
  'video',
] as const;
export type BlockType = (typeof BlockTypes)[number];
