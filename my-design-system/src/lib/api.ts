// src/lib/api.ts
// Central API client for all backend calls.
// Base URL: PUBLIC_API_URL env var (defaults to http://localhost:3001).

import type { Commission, Project, Interaction, PaginatedResult, AdminStats, Status } from './types';
import { getAccessTokenFromCookie } from './auth-utils';

const BASE =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PUBLIC_API_URL) ||
  'http://localhost:3001';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAccessTokenFromCookie();
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...init?.headers,
    },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API ${res.status} ${path}: ${body}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ── Commissions ────────────────────────────────────────────────────────────

export function listCommissions(params?: { page?: number; limit?: number; client?: string }) {
  const q = new URLSearchParams();
  if (params?.page)   q.set('page',   String(params.page));
  if (params?.limit)  q.set('limit',  String(params.limit));
  if (params?.client) q.set('client', params.client);
  return request<PaginatedResult<Commission>>(`/commissions?${q}`);
}

export function getCommissionStats() {
  return request<AdminStats>('/commissions/stats');
}

export function createCommission(payload: {
  client: string;
  title: string;
  appType: string;
  note?: string;
  budget?: string;
  shortDesc?: string;
  longDesc?: string;
}) {
  return request<Commission>('/commissions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function patchCommissionStatus(id: string, status: Status) {
  return request<Commission>(`/commissions/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

// ── Projects ───────────────────────────────────────────────────────────────

export function listProjects(params?: { page?: number; limit?: number }) {
  const q = new URLSearchParams();
  if (params?.page)  q.set('page',  String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  return request<PaginatedResult<Project>>(`/projects?${q}`);
}

export function createProject(payload: Omit<Project, 'id'>) {
  return request<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateProject(id: string, payload: Partial<Omit<Project, 'id'>>) {
  return request<Project>(`/projects/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteProjectAPI(id: string) {
  return request<void>(`/projects/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

// ── Interactions ───────────────────────────────────────────────────────────

export function listInteractions(params?: { page?: number; limit?: number }) {
  const q = new URLSearchParams();
  if (params?.page)  q.set('page',  String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  return request<PaginatedResult<Interaction>>(`/interactions?${q}`);
}

export function incrementInteraction(
  date: string,
  deltas?: { links?: number; projects?: number; commissions?: number },
) {
  return request<Interaction>(
    `/interactions/${encodeURIComponent(date)}/increment`,
    { method: 'POST', body: JSON.stringify(deltas ?? {}) },
  );
}
