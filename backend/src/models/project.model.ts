import { z } from 'zod';

export const ProjectCreateSchema = z.object({
  title: z.string().min(1, 'title is required'),
  type: z.string().min(1, 'type is required'),
  desc: z.string().min(1, 'desc is required'),
  imageAlt: z.string().min(1, 'imageAlt is required'),
  image: z.string().optional().default(''),
  tags: z.array(z.string()).optional().default([]),
});

export const ProjectUpdateSchema = ProjectCreateSchema.partial();

export type ProjectCreate = z.infer<typeof ProjectCreateSchema>;
export type ProjectUpdate = z.infer<typeof ProjectUpdateSchema>;

export interface Project {
  id: string; // UUID
  image: string;
  imageAlt: string;
  type: string;
  title: string;
  desc: string;
  tags: string[];
}
