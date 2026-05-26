import { z } from 'zod';

export const StatusSchema = z.enum(['pending', 'active', 'completed', 'overdue']);
export type Status = z.infer<typeof StatusSchema>;

export const CommissionCreateSchema = z.object({
  client: z.string().min(1, 'client is required'),
  title: z.string().min(1, 'title is required'),
  appType: z.string().min(1, 'appType is required'),
  note: z.string().optional(),
  budget: z.string().optional(),
  shortDesc: z.string().optional(),
  longDesc: z.string().optional(),
});

export const CommissionUpdateSchema = CommissionCreateSchema.partial().extend({
  status: StatusSchema.optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'dueDate must be YYYY-MM-DD').optional(),
});

export const CommissionStatusPatchSchema = z.object({
  status: StatusSchema,
});

export type CommissionCreate = z.infer<typeof CommissionCreateSchema>;
export type CommissionUpdate = z.infer<typeof CommissionUpdateSchema>;

export interface Commission {
  id: string;
  client: string;
  title: string;
  appType: string;
  status: Status;
  date: string;    // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  note?: string;
  budget?: string;
  shortDesc?: string;
  longDesc?: string;
}
