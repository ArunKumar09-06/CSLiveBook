import { z } from 'zod';
import { ResourceSources, ResourceTypes } from '../enums/index.js';

export const VideoChapterSchema = z.object({
  timestamp: z.number().nonnegative(), // in seconds
  title: z.string(),
});
export type VideoChapter = z.infer<typeof VideoChapterSchema>;

export const VideoMetadataSchema = z.object({
  duration: z.number().optional(), // in seconds
  size: z.number().optional(),
  format: z.string().optional(),
  originalName: z.string().optional(),
  chapters: z.array(VideoChapterSchema).default([]),
});
export type VideoMetadata = z.infer<typeof VideoMetadataSchema>;

export const StructuredCheatSheetSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  color: z.string().optional(),
  items: z.array(
    z.object({
      label: z.string(),
      description: z.string(),
      codeSnippet: z.string().optional(),
      highlight: z.boolean().optional(),
    })
  ),
});

export const StructuredCheatSheetSchema = z.object({
  conceptId: z.string(),
  conceptTitle: z.string(),
  quickSummary: z.string(),
  sections: z.array(StructuredCheatSheetSectionSchema),
  keyFormulasOrRules: z.array(z.string()).optional(),
  commonPitfalls: z.array(z.string()).optional(),
  interviewOneLiners: z.array(z.string()).optional(),
});
export type StructuredCheatSheet = z.infer<typeof StructuredCheatSheetSchema>;

export const ConceptResourceSchema = z.object({
  id: z.string().optional(),
  conceptId: z.string(),
  type: z.enum(ResourceTypes),
  source: z.enum(ResourceSources),
  content: z.string(), // URL, Markdown text, or JSON string of structured blocks
  metadata: VideoMetadataSchema.optional(),
  isPublished: z.boolean().default(true),
});
export type ConceptResource = z.infer<typeof ConceptResourceSchema>;
