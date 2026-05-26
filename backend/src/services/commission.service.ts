import { store } from '../store/memory.store';
import type { Commission, CommissionCreate, CommissionUpdate, Status } from '../models/commission.model';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function paginate<T>(items: T[], page: number, limit: number): PaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  return { data: items.slice(start, start + limit), total, page, limit, totalPages };
}

export const CommissionService = {
  list(page = 1, limit = 10): PaginatedResult<Commission> {
    return paginate([...store.commissions.values()], page, limit);
  },

  listByClient(client: string, page = 1, limit = 10): PaginatedResult<Commission> {
    const filtered = [...store.commissions.values()].filter(c => c.client === client);
    return paginate(filtered, page, limit);
  },

  getStats() {
    const all = [...store.commissions.values()];
    const total = all.length;
    const active = all.filter(c => c.status === 'active').length;
    const completed = all.filter(c => c.status === 'completed').length;
    const overdue = all.filter(c => c.status === 'overdue').length;
    const pending = all.filter(c => c.status === 'pending').length;
    const revenue = completed * 800;

    const monthNames = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    const chartData = monthNames.map((month, idx) => ({
      month,
      // Last month reflects live active+pending count; others use a stable mock value
      value: idx === monthNames.length - 1 ? active + pending : (idx + 1) * 2,
    }));

    const recentActivity = all.slice(0, 5);
    return { total, active, completed, overdue, pending, revenue, chartData, recentActivity };
  },

  getById(id: string): Commission | null {
    return store.commissions.get(id) ?? null;
  },

  create(payload: CommissionCreate): Commission {
    store.commissionCounter++;
    const id = `COM-${String(store.commissionCounter).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    const due = new Date();
    due.setDate(due.getDate() + 30);
    const commission: Commission = {
      ...payload,
      id,
      status: 'pending',
      date: today,
      dueDate: due.toISOString().split('T')[0],
      note: payload.note ?? 'Will review within 2 business days.',
    };
    store.commissions.set(id, commission);
    return commission;
  },

  update(id: string, payload: CommissionUpdate): Commission | null {
    const existing = store.commissions.get(id);
    if (!existing) return null;
    const updated: Commission = { ...existing, ...payload };
    store.commissions.set(id, updated);
    return updated;
  },

  patchStatus(id: string, status: Status): Commission | null {
    const existing = store.commissions.get(id);
    if (!existing) return null;
    const updated: Commission = { ...existing, status };
    store.commissions.set(id, updated);
    return updated;
  },

  remove(id: string): boolean {
    return store.commissions.delete(id);
  },
};
