import { z } from 'zod';
import { AssessmentTypes, AttemptStatuses, QuestionTypes } from '../enums/index.js';

export const QuestionOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
});
export type QuestionOption = z.infer<typeof QuestionOptionSchema>;

// Correct answer schema can be a single option id, multiple option ids, or matching pairs
export const CorrectAnswerSchema = z.union([
  z.string(),
  z.array(z.string()),
  z.record(z.string(), z.string()), // for MATCHING pairs
]);
export type CorrectAnswer = z.infer<typeof CorrectAnswerSchema>;

export const QuestionSchema = z.object({
  id: z.string(),
  type: z.enum(QuestionTypes),
  prompt: z.string(),
  options: z.array(QuestionOptionSchema).default([]),
  correctAnswer: CorrectAnswerSchema, // NEVER sent to learner queries
  explanation: z.string(),
  points: z.number().int().positive().default(1),
  order: z.number().int().default(0),
  tags: z.array(z.string()).default([]),
  learningObjective: z.string().optional(),
});
export type Question = z.infer<typeof QuestionSchema>;

// Public Question (learner facing - NEVER has correctAnswer)
export const PublicQuestionSchema = QuestionSchema.omit({
  correctAnswer: true,
  explanation: true,
});
export type PublicQuestion = z.infer<typeof PublicQuestionSchema>;

export const AssessmentSchema = z.object({
  id: z.string().optional(),
  conceptId: z.string().optional(),
  moduleId: z.string().optional(),
  type: z.enum(AssessmentTypes),
  title: z.string().min(1),
  description: z.string().default(''),
  timeLimit: z.number().int().nonnegative().default(600), // in seconds, 0 = no limit
  passingScore: z.number().int().min(0).max(100).default(70),
  isPublished: z.boolean().default(true),
  questions: z.array(QuestionSchema),
});
export type Assessment = z.infer<typeof AssessmentSchema>;

export const PublicAssessmentSchema = AssessmentSchema.extend({
  questions: z.array(PublicQuestionSchema),
});
export type PublicAssessment = z.infer<typeof PublicAssessmentSchema>;

export const SubmitAnswerInputSchema = z.object({
  questionId: z.string(),
  response: CorrectAnswerSchema, // user submitted answer
});
export type SubmitAnswerInput = z.infer<typeof SubmitAnswerInputSchema>;

export const SubmitAttemptInputSchema = z.object({
  answers: z.array(SubmitAnswerInputSchema),
});
export type SubmitAttemptInput = z.infer<typeof SubmitAttemptInputSchema>;

export const GradedAnswerSchema = z.object({
  questionId: z.string(),
  response: CorrectAnswerSchema,
  isCorrect: z.boolean(),
  score: z.number(),
  maxScore: z.number(),
  explanation: z.string(),
  correctAnswer: CorrectAnswerSchema,
  learningObjective: z.string().optional(),
});
export type GradedAnswer = z.infer<typeof GradedAnswerSchema>;

export const AttemptResultSchema = z.object({
  attemptId: z.string(),
  assessmentId: z.string(),
  status: z.enum(AttemptStatuses),
  score: z.number(), // percentage
  rawScore: z.number(),
  maxScore: z.number(),
  passed: z.boolean(),
  passingScore: z.number(),
  startedAt: z.string(),
  submittedAt: z.string(),
  answers: z.array(GradedAnswerSchema),
  weakAreas: z.array(z.string()).optional(),
});
export type AttemptResult = z.infer<typeof AttemptResultSchema>;
