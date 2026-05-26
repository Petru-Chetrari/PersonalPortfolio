import { AppDataSource } from '../data-source';
import { InteractionEntity } from '../entities/Interaction';
import type { Interaction, InteractionCreate, InteractionUpdate, InteractionIncrement } from '../models/interaction.model';
import type { PaginatedResult } from './commission.service';

export const InteractionService = {
  async list(page = 1, limit = 10): Promise<PaginatedResult<Interaction>> {
    const repo = AppDataSource.getRepository(InteractionEntity);
    const [entities, total] = await repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { date: 'DESC' },
    });

    return {
      data: entities,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },

  async getByDate(date: string): Promise<Interaction | null> {
    const repo = AppDataSource.getRepository(InteractionEntity);
    return await repo.findOneBy({ date });
  },

  async create(payload: InteractionCreate): Promise<Interaction | null> {
    const repo = AppDataSource.getRepository(InteractionEntity);
    const existing = await repo.findOneBy({ date: payload.date });
    if (existing) return null;

    const entity = repo.create(payload);
    await repo.save(entity);
    return entity;
  },

  async update(date: string, payload: InteractionUpdate): Promise<Interaction | null> {
    const repo = AppDataSource.getRepository(InteractionEntity);
    const entity = await repo.findOneBy({ date });
    if (!entity) return null;

    if (payload.links !== undefined) entity.links = payload.links;
    if (payload.projects !== undefined) entity.projects = payload.projects;
    if (payload.commissions !== undefined) entity.commissions = payload.commissions;

    await repo.save(entity);
    return entity;
  },

  async increment(date: string, deltas: InteractionIncrement): Promise<Interaction> {
    const repo = AppDataSource.getRepository(InteractionEntity);
    
    const dLinks = deltas.links ?? 10;
    const dProjects = deltas.projects ?? 1;
    const dCommissions = deltas.commissions ?? 1;

    // We can use a transaction or just an atomic update if SQLite supported it easily.
    // For simplicity, we find and save.
    let entity = await repo.findOneBy({ date });
    if (entity) {
      entity.links += dLinks;
      entity.projects += dProjects;
      entity.commissions += dCommissions;
    } else {
      entity = repo.create({
        date,
        links: dLinks,
        projects: dProjects,
        commissions: dCommissions,
      });
    }

    await repo.save(entity);
    return entity;
  },

  async remove(date: string): Promise<boolean> {
    const repo = AppDataSource.getRepository(InteractionEntity);
    const result = await repo.delete(date);
    return (result.affected ?? 0) > 0;
  },
};
