import { z } from 'zod';
import { Difficulties } from '../enums/index.js';

export const TableOfContentsItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  level: z.number().int().min(1).max(4),
});
export type TableOfContentsItem = z.infer<typeof TableOfContentsItemSchema>;

export const SubjectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string(),
  icon: z.string(),
  themeKey: z.string(), // e.g. 'dbms', 'oop', 'os', 'cn', 'devops', 'ca', 'sd', 'ai'
  order: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});
export type Subject = z.infer<typeof SubjectSchema>;

export const ModuleSchema = z.object({
  id: z.string().optional(),
  subjectId: z.string(),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string(),
  order: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});
export type Module = z.infer<typeof ModuleSchema>;

export const ConceptSchema = z.object({
  id: z.string().optional(),
  moduleId: z.string(),
  conceptCode: z.string().min(1), // e.g. 'C1', 'C2'
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  estimatedMinutes: z.number().int().positive().default(15),
  difficulty: z.enum(Difficulties).default('BEGINNER'),
  prerequisites: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  order: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});
export type Concept = z.infer<typeof ConceptSchema>;
