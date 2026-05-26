import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { InteractionService } from '../services/interaction.service';
import {
  InteractionCreateSchema,
  InteractionUpdateSchema,
  InteractionIncrementSchema,
} from '../models/interaction.model';

function parsePageLimit(req: Request) {
  const page = parseInt(req.query['page'] as string) || 1;
  const limit = parseInt(req.query['limit'] as string) || 10;
  return { page, limit };
}

export const InteractionController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit } = parsePageLimit(req);
      res.json(await InteractionService.list(page, limit));
    } catch (err) {
      next(err);
    }
  },

  async getByDate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const interaction = await InteractionService.getByDate(req.params['date'] as string);
      if (!interaction) { res.status(404).json({ error: 'Interaction not found' }); return; }
      res.json(interaction);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload = InteractionCreateSchema.parse(req.body);
      const result = await InteractionService.create(payload);
      if (!result) {
        res.status(409).json({ error: `Interaction for date "${payload.date}" already exists` });
        return;
      }
      res.status(201).json(result);
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
      const payload = InteractionUpdateSchema.parse(req.body);
      const result = await InteractionService.update(req.params['date'] as string, payload);
      if (!result) { res.status(404).json({ error: 'Interaction not found' }); return; }
      res.json(result);
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({ error: 'Validation failed', details: err.errors });
        return;
      }
      next(err);
    }
  },

  async increment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deltas = InteractionIncrementSchema.parse(req.body ?? {});
      const result = await InteractionService.increment(req.params['date'] as string, deltas);
      res.json(result);
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
      const deleted = await InteractionService.remove(req.params['date'] as string);
      if (!deleted) { res.status(404).json({ error: 'Interaction not found' }); return; }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
