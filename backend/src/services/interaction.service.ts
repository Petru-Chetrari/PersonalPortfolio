import { store } from '../store/memory.store';
import type { Interaction, InteractionCreate, InteractionUpdate, InteractionIncrement } from '../models/interaction.model';
import type { PaginatedResult } from './commission.service';

function paginate<T>(items: T[], page: number, limit: number): PaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  return { data: items.slice(start, start + limit), total, page, limit, totalPages };
}

export const InteractionService = {
  list(page = 1, limit = 10): PaginatedResult<Interaction> {
    return paginate([...store.interactions.values()], page, limit);
  },

  getByDate(date: string): Interaction | null {
    return store.interactions.get(date) ?? null;
  },

  /** Returns null if date already exists (caller should respond 409). */
  create(payload: InteractionCreate): Interaction | null {
    if (store.interactions.has(payload.date)) return null;
    const entry: Interaction = { ...payload };
    store.interactions.set(payload.date, entry);
    return entry;
  },

  /** Returns null if date not found (caller should respond 404). */
  update(date: string, payload: InteractionUpdate): Interaction | null {
    const existing = store.interactions.get(date);
    if (!existing) return null;
    const updated: Interaction = {
      ...existing,
      ...(payload.links !== undefined && { links: payload.links }),
      ...(payload.projects !== undefined && { projects: payload.projects }),
      ...(payload.commissions !== undefined && { commissions: payload.commissions }),
    };
    store.interactions.set(date, updated);
    return updated;
  },

  /**
   * Generalisation of incrementMar9Interactions from the mock repository.
   * Upserts the entry: increments counters if existing, creates with delta values if new.
   * Defaults: links += 10, projects += 1, commissions += 1.
   */
  increment(date: string, deltas: InteractionIncrement): Interaction {
    const dLinks = deltas.links ?? 10;
    const dProjects = deltas.projects ?? 1;
    const dCommissions = deltas.commissions ?? 1;

    const existing = store.interactions.get(date);
    if (existing) {
      const updated: Interaction = {
        ...existing,
        links: existing.links + dLinks,
        projects: existing.projects + dProjects,
        commissions: existing.commissions + dCommissions,
      };
      store.interactions.set(date, updated);
      return updated;
    }

    // Upsert: create with delta as initial values
    const newEntry: Interaction = {
      date,
      links: dLinks,
      projects: dProjects,
      commissions: dCommissions,
    };
    store.interactions.set(date, newEntry);
    return newEntry;
  },

  remove(date: string): boolean {
    return store.interactions.delete(date);
  },
};
