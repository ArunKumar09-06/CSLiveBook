import { z } from 'zod';

export const PaginationMetaSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(20),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative().optional(),
});
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;

export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.any().optional(),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
}
