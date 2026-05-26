import { v4 as uuidv4 } from 'uuid';
import type { Commission } from '../models/commission.model';
import type { Project } from '../models/project.model';
import type { Interaction } from '../models/interaction.model';

// ── Seed data ────────────────────────────────────────────────────────────────

const SEED_COMMISSIONS: Commission[] = [
  { id: 'COM-001', client: 'Alex M.', title: 'Portfolio Website Redesign', appType: 'Web App', status: 'active', date: '2026-03-20', dueDate: '2026-04-15', note: 'Wire-frames sent, awaiting feedback on hero section.' },
  { id: 'COM-002', client: 'Sarah K.', title: 'E-commerce Dashboard', appType: 'Web App', status: 'pending', date: '2026-03-28', dueDate: '2026-04-30', note: 'Will review within 2 business days.' },
  { id: 'COM-003', client: 'Jordan T.', title: 'Mobile App UI Design', appType: 'Mobile App', status: 'completed', date: '2026-03-01', dueDate: '2026-03-25', note: 'All deliverables sent. Great working with you!' },
  { id: 'COM-004', client: 'Priya S.', title: 'SaaS Landing Page', appType: 'Marketing', status: 'overdue', date: '2026-02-15', dueDate: '2026-03-10' },
  { id: 'COM-005', client: 'Marco R.', title: 'Brand Identity System', appType: 'Design', status: 'active', date: '2026-03-22', dueDate: '2026-04-20' },
  { id: 'COM-006', client: 'Liu W.', title: 'Admin Panel Overhaul', appType: 'Web App', status: 'pending', date: '2026-03-30', dueDate: '2026-05-01' },
];

const SEED_PROJECTS_RAW = [
  { image: '/assets/figma-exports/project-nova.png', imageAlt: 'Nova Modern Interface screenshot', type: 'SaaS Platform', title: 'Nova Modern Interface', desc: 'A sleek and minimal interface for a B2B SaaS platform. Emphasis on clear typography, whitespace, and micro-interactions.', tags: ['Next.js', 'TailwindCSS', 'Prisma', 'PostgreSQL'] },
  { image: '/assets/figma-exports/project-lumina.png', imageAlt: 'Lumina Mobile Banking screenshot', type: 'Mobile Design Prototype', title: 'Lumina Mobile Banking', desc: 'A high-fidelity prototype for a modern mobile banking app focusing on user experience and accessibility. Complete with light and dark themes.', tags: ['React Native', 'Expo', 'Zustand', 'Framer Motion'] },
  { image: '/assets/figma-exports/project-aura.png', imageAlt: 'Aura Analytics Dashboard screenshot', type: 'Web Application', title: 'Aura Analytics Dashboard', desc: 'A comprehensive real-time analytics dashboard built with React and Tailwind CSS. Features dark mode, responsive design, and intuitive data visualization.', tags: ['React', 'TypeScript', 'WebSocket', 'Tailwind', 'Recharts'] },
];

const SEED_INTERACTIONS: Interaction[] = [
  { date: 'Mar 01', links: 120, projects: 150, commissions: 80 },
  { date: 'Mar 02', links: 135, projects: 160, commissions: 90 },
  { date: 'Mar 03', links: 105, projects: 140, commissions: 70 },
  { date: 'Mar 04', links: 130, projects: 170, commissions: 100 },
  { date: 'Mar 05', links: 180, projects: 190, commissions: 110 },
  { date: 'Mar 06', links: 210, projects: 200, commissions: 120 },
  { date: 'Mar 07', links: 190, projects: 180, commissions: 110 },
  { date: 'Mar 08', links: 220, projects: 210, commissions: 130 },
  { date: 'Mar 10', links: 240, projects: 220, commissions: 140 },
];

// ── Singleton store object ────────────────────────────────────────────────────

export const store = {
  commissions: new Map<string, Commission>(),
  /** Monotonic counter — never decrements on delete, preventing ID reuse */
  commissionCounter: 0,
  projects: new Map<string, Project>(),
  interactions: new Map<string, Interaction>(),
};

// ── Reset / seed (called on module load and in test beforeEach) ───────────────

export function resetStore(): void {
  // Commissions
  store.commissions.clear();
  store.commissionCounter = SEED_COMMISSIONS.length;
  SEED_COMMISSIONS.forEach(c => store.commissions.set(c.id, { ...c }));

  // Projects — fresh UUIDs every reset (tests must fetch IDs dynamically)
  store.projects.clear();
  SEED_PROJECTS_RAW.forEach(raw => {
    const id = uuidv4();
    const project: Project = { ...raw, id };
    store.projects.set(id, project);
  });

  // Interactions
  store.interactions.clear();
  SEED_INTERACTIONS.forEach(i => store.interactions.set(i.date, { ...i }));
}

// Initialize on first import
resetStore();
