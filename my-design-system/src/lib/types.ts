// src/lib/types.ts
// Shared domain types. Import from here; import data operations from api.ts.

export type Status = 'pending' | 'active' | 'completed' | 'overdue';

export interface Commission {
  id: string;
  client: string;
  title: string;
  appType: string;
  status: Status;
  date: string;
  dueDate: string;
  note?: string;
  budget?: string;
  shortDesc?: string;
  longDesc?: string;
}

export interface Project {
  id: string;
  title: string;
  type: string;
  desc: string;
  image: string;
  imageAlt: string;
  tags: string[];
}

export interface Interaction {
  date: string;
  links: number;
  projects: number;
  commissions: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminStats {
  total: number;
  active: number;
  completed: number;
  overdue: number;
  pending: number;
  revenue: number;
  recentActivity: Commission[];
}
