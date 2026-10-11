import { z } from 'zod';
import { ConceptStatuses } from '../enums/index.js';

export const UserConceptProgressSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  conceptId: z.string(),
  status: z.enum(ConceptStatuses).default('NOT_STARTED'),
  startedAt: z.date().optional(),
  completedAt: z.date().optional(),
  lastAccessedAt: z.date().optional(),
  bestScore: z.number().optional(),
  attemptsCount: z.number().int().default(0),
  lastBlockId: z.string().optional(),
  videoPositionSec: z.number().default(0),
});
export type UserConceptProgress = z.infer<typeof UserConceptProgressSchema>;

export const NoteSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  conceptId: z.string(),
  blockId: z.string().optional(),
  text: z.string().min(1, 'Note cannot be empty'),
  createdAt: z.date().optional(),
});
export type Note = z.infer<typeof NoteSchema>;

export const ActivityLogSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format'),
  minutes: z.number().nonnegative().default(0),
  conceptsTouched: z.number().nonnegative().default(0),
  quizzesTaken: z.number().nonnegative().default(0),
});
export type ActivityLog = z.infer<typeof ActivityLogSchema>;

export const SavePositionInputSchema = z.object({
  lastBlockId: z.string().optional(),
  videoPositionSec: z.number().nonnegative().optional(),
});
export type SavePositionInput = z.infer<typeof SavePositionInputSchema>;
