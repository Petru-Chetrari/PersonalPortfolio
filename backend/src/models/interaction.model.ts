import { z } from 'zod';

export const InteractionCreateSchema = z.object({
  date: z.string().min(1, 'date is required'),
  links: z.number().int().min(0, 'links must be a non-negative integer'),
  projects: z.number().int().min(0, 'projects must be a non-negative integer'),
  commissions: z.number().int().min(0, 'commissions must be a non-negative integer'),
});

// Update excludes date (date is the key — immutable via PUT)
export const InteractionUpdateSchema = InteractionCreateSchema.omit({ date: true }).partial();

export const InteractionIncrementSchema = z.object({
  links: z.number().int().optional(),
  projects: z.number().int().optional(),
  commissions: z.number().int().optional(),
});

export type InteractionCreate = z.infer<typeof InteractionCreateSchema>;
export type InteractionUpdate = z.infer<typeof InteractionUpdateSchema>;
export type InteractionIncrement = z.infer<typeof InteractionIncrementSchema>;

export interface Interaction {
  date: string;
  links: number;
  projects: number;
  commissions: number;
}
