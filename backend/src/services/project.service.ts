import { v4 as uuidv4 } from 'uuid';
import { store } from '../store/memory.store';
import type { Project, ProjectCreate, ProjectUpdate } from '../models/project.model';
import type { PaginatedResult } from './commission.service';

function paginate<T>(items: T[], page: number, limit: number): PaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  return { data: items.slice(start, start + limit), total, page, limit, totalPages };
}

export const ProjectService = {
  list(page = 1, limit = 10): PaginatedResult<Project> {
    return paginate([...store.projects.values()], page, limit);
  },

  getById(id: string): Project | null {
    return store.projects.get(id) ?? null;
  },

  create(payload: ProjectCreate): Project {
    const id = uuidv4();
    const project: Project = {
      id,
      image: payload.image ?? '',
      imageAlt: payload.imageAlt,
      type: payload.type,
      title: payload.title,
      desc: payload.desc,
      tags: payload.tags ?? [],
    };
    store.projects.set(id, project);
    return project;
  },

  update(id: string, payload: ProjectUpdate): Project | null {
    const existing = store.projects.get(id);
    if (!existing) return null;
    const updated: Project = { ...existing, ...payload };
    store.projects.set(id, updated);
    return updated;
  },

  remove(id: string): boolean {
    return store.projects.delete(id);
  },
};
