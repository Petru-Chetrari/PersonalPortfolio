import { AppDataSource } from '../data-source';
import { CommissionEntity } from '../entities/Commission';
import type { Commission, CommissionCreate, CommissionUpdate, Status } from '../models/commission.model';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Function generates sequential IDs like COM-001, COM-002
async function generateCommissionId(): Promise<string> {
  const repo = AppDataSource.getRepository(CommissionEntity);
  const count = await repo.count();
  return `COM-${String(count + 1).padStart(3, '0')}`;
}

export const CommissionService = {
  async list(page = 1, limit = 10): Promise<PaginatedResult<Commission>> {
    const repo = AppDataSource.getRepository(CommissionEntity);
    const [entities, total] = await repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { date: 'DESC' },
    });

    return {
      data: entities.map(this.mapToModel),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },

  async listByClient(client: string, page = 1, limit = 10): Promise<PaginatedResult<Commission>> {
    const repo = AppDataSource.getRepository(CommissionEntity);
    const [entities, total] = await repo.findAndCount({
      where: { client },
      skip: (page - 1) * limit,
      take: limit,
      order: { date: 'DESC' },
    });

    return {
      data: entities.map(this.mapToModel),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },

  async getStats() {
    const repo = AppDataSource.getRepository(CommissionEntity);
    
    // Perform basic statistics and filters using TypeORM QueryBuilder
    const total = await repo.count();
    const active = await repo.countBy({ status: 'active' });
    const completed = await repo.countBy({ status: 'completed' });
    const overdue = await repo.countBy({ status: 'overdue' });
    const pending = await repo.countBy({ status: 'pending' });
    
    const revenue = completed * 800; // Mock calculation based on completed

    const monthNames = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    const chartData = monthNames.map((month, idx) => ({
      month,
      value: idx === monthNames.length - 1 ? active + pending : (idx + 1) * 2,
    }));

    const recentEntities = await repo.find({
      order: { date: 'DESC' },
      take: 5,
    });

    return { total, active, completed, overdue, pending, revenue, chartData, recentActivity: recentEntities.map(this.mapToModel) };
  },

  async getById(id: string): Promise<Commission | null> {
    const repo = AppDataSource.getRepository(CommissionEntity);
    const entity = await repo.findOneBy({ id });
    return entity ? this.mapToModel(entity) : null;
  },

  async create(payload: CommissionCreate): Promise<Commission> {
    const repo = AppDataSource.getRepository(CommissionEntity);
    const id = await generateCommissionId();
    
    const today = new Date().toISOString().split('T')[0];
    const due = new Date();
    due.setDate(due.getDate() + 30);

    const commission = repo.create({
      ...payload,
      id,
      status: 'pending',
      date: today as string,
      dueDate: due.toISOString().split('T')[0] as string,
      note: payload.note ?? 'Will review within 2 business days.',
    });

    await repo.save(commission);
    return this.mapToModel(commission);
  },

  async update(id: string, payload: CommissionUpdate): Promise<Commission | null> {
    const repo = AppDataSource.getRepository(CommissionEntity);
    const entity = await repo.findOneBy({ id });
    if (!entity) return null;

    Object.assign(entity, payload);
    await repo.save(entity);
    return this.mapToModel(entity);
  },

  async patchStatus(id: string, status: Status): Promise<Commission | null> {
    const repo = AppDataSource.getRepository(CommissionEntity);
    const entity = await repo.findOneBy({ id });
    if (!entity) return null;

    entity.status = status;
    await repo.save(entity);
    return this.mapToModel(entity);
  },

  async remove(id: string): Promise<boolean> {
    const repo = AppDataSource.getRepository(CommissionEntity);
    const result = await repo.delete(id);
    return (result.affected ?? 0) > 0;
  },

  mapToModel(entity: CommissionEntity): Commission {
    return {
      id: entity.id,
      client: entity.client,
      title: entity.title,
      appType: entity.appType,
      status: entity.status as Status,
      date: entity.date,
      dueDate: entity.dueDate,
      note: entity.note ?? undefined,
      budget: entity.budget ?? undefined,
      shortDesc: entity.shortDesc ?? undefined,
      longDesc: entity.longDesc ?? undefined,
    };
  }
};
