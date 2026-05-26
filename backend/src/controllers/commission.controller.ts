import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { CommissionService } from '../services/commission.service';
import {
  CommissionCreateSchema,
  CommissionUpdateSchema,
  CommissionStatusPatchSchema,
} from '../models/commission.model';

function parsePageLimit(req: Request) {
  const page = parseInt(req.query['page'] as string) || 1;
  const limit = parseInt(req.query['limit'] as string) || 10;
  return { page, limit };
}

export const CommissionController = {
  list(req: Request, res: Response, next: NextFunction): void {
    try {
      const { page, limit } = parsePageLimit(req);
      const client = req.query['client'] as string | undefined;
      const result = client
        ? CommissionService.listByClient(client, page, limit)
        : CommissionService.list(page, limit);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  stats(_req: Request, res: Response, next: NextFunction): void {
    try {
      res.json(CommissionService.getStats());
    } catch (err) {
      next(err);
    }
  },

  getById(req: Request, res: Response, next: NextFunction): void {
    try {
      const commission = CommissionService.getById(req.params['id'] as string);
      if (!commission) { res.status(404).json({ error: 'Commission not found' }); return; }
      res.json(commission);
    } catch (err) {
      next(err);
    }
  },

  create(req: Request, res: Response, next: NextFunction): void {
    try {
      const payload = CommissionCreateSchema.parse(req.body);
      const commission = CommissionService.create(payload);
      res.status(201).json(commission);
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({ error: 'Validation failed', details: err.errors });
        return;
      }
      next(err);
    }
  },

  update(req: Request, res: Response, next: NextFunction): void {
    try {
      const payload = CommissionUpdateSchema.parse(req.body);
      const commission = CommissionService.update(req.params['id'] as string, payload);
      if (!commission) { res.status(404).json({ error: 'Commission not found' }); return; }
      res.json(commission);
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({ error: 'Validation failed', details: err.errors });
        return;
      }
      next(err);
    }
  },

  patchStatus(req: Request, res: Response, next: NextFunction): void {
    try {
      const { status } = CommissionStatusPatchSchema.parse(req.body);
      const commission = CommissionService.patchStatus(req.params['id'] as string, status);
      if (!commission) { res.status(404).json({ error: 'Commission not found' }); return; }
      res.json(commission);
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({ error: 'Validation failed', details: err.errors });
        return;
      }
      next(err);
    }
  },

  remove(req: Request, res: Response, next: NextFunction): void {
    try {
      const deleted = CommissionService.remove(req.params['id'] as string);
      if (!deleted) { res.status(404).json({ error: 'Commission not found' }); return; }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
