import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ProjectService } from '../services/project.service';
import { ProjectCreateSchema, ProjectUpdateSchema } from '../models/project.model';

function parsePageLimit(req: Request) {
  const page = parseInt(req.query['page'] as string) || 1;
  const limit = parseInt(req.query['limit'] as string) || 10;
  return { page, limit };
}

export const ProjectController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit } = parsePageLimit(req);
      res.json(await ProjectService.list(page, limit));
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await ProjectService.getById(req.params['id'] as string);
      if (!project) { res.status(404).json({ error: 'Project not found' }); return; }
      res.json(project);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload = ProjectCreateSchema.parse(req.body);
      res.status(201).json(await ProjectService.create(payload));
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({ error: 'Validation failed', details: err.errors });
        return;
      }
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload = ProjectUpdateSchema.parse(req.body);
      const project = await ProjectService.update(req.params['id'] as string, payload);
      if (!project) { res.status(404).json({ error: 'Project not found' }); return; }
      res.json(project);
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({ error: 'Validation failed', details: err.errors });
        return;
      }
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await ProjectService.remove(req.params['id'] as string);
      if (!deleted) { res.status(404).json({ error: 'Project not found' }); return; }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
