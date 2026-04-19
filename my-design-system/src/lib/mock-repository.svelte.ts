// src/lib/mock-repository.ts

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

export interface Interaction {
  date: string;
  links: number;
  projects: number;
  commissions: number;
}

// In-memory state (survives Astro View Transition navigation but resets on hard refresh)
let commissions: Commission[] = $state([
  { id: 'COM-001', client: 'Alex M.', title: 'Portfolio Website Redesign', appType: 'Web App', status: 'active', date: '2026-03-20', dueDate: '2026-04-15', note: 'Wire-frames sent, awaiting feedback on hero section.' },
  { id: 'COM-002', client: 'Sarah K.', title: 'E-commerce Dashboard', appType: 'Web App', status: 'pending', date: '2026-03-28', dueDate: '2026-04-30', note: 'Will review within 2 business days.' },
  { id: 'COM-003', client: 'Jordan T.', title: 'Mobile App UI Design', appType: 'Mobile App', status: 'completed', date: '2026-03-01', dueDate: '2026-03-25', note: 'All deliverables sent. Great working with you!' },
  { id: 'COM-004', client: 'Priya S.', title: 'SaaS Landing Page', appType: 'Marketing', status: 'overdue', date: '2026-02-15', dueDate: '2026-03-10' },
  { id: 'COM-005', client: 'Marco R.', title: 'Brand Identity System', appType: 'Design', status: 'active', date: '2026-03-22', dueDate: '2026-04-20' },
  { id: 'COM-006', client: 'Liu W.', title: 'Admin Panel Overhaul', appType: 'Web App', status: 'pending', date: '2026-03-30', dueDate: '2026-05-01' },
]);

let interactions = $state([
  { date: 'Mar 01', links: 120, projects: 150, commissions: 80 },
  { date: 'Mar 02', links: 135, projects: 160, commissions: 90 },
  { date: 'Mar 03', links: 105, projects: 140, commissions: 70 },
  { date: 'Mar 04', links: 130, projects: 170, commissions: 100 },
  { date: 'Mar 05', links: 180, projects: 190, commissions: 110 },
  { date: 'Mar 06', links: 210, projects: 200, commissions: 120 },
  { date: 'Mar 07', links: 190, projects: 180, commissions: 110 },
  { date: 'Mar 08', links: 220, projects: 210, commissions: 130 },
  { date: 'Mar 10', links: 240, projects: 220, commissions: 140 },
]);

export const MockRepository = {
  getCommissions: () => {
    return [...commissions];
  },

  getClientCommissions: (clientName = 'Current User') => {
    // For mock purposes, standardizing some commissions as "My" commissions, plus any new ones added.
    return commissions.filter(c => c.client === clientName || c.client === 'Alex M.' || c.client === 'Sarah K.' || c.client === 'Jordan T.');
  },

  getInteractions: () => {
    return [...interactions];
  },


  addInteraction: (date: string, links: number, projects: number, commissions: number) => {
    const newInteraction: Interaction = {
      date,
      links,
      projects,
      commissions
    };
    interactions = [...interactions, newInteraction];
    return newInteraction;
  },

  updateInteraction: (date: string, links: number, projects: number, commissions: number) => {
    const idx = interactions.findIndex(i => i.date === date);
    if (idx !== -1) {
      interactions[idx] = { ...interactions[idx], links, projects, commissions };
      return true;
    }
    return false;
  },

  addCommission: (data: Omit<Commission, 'id' | 'status' | 'date' | 'dueDate'>) => {
    const newId = `COM-${String(commissions.length + 1).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];

    // Estimate due date as +30 days
    const due = new Date();
    due.setDate(due.getDate() + 30);
    const dueDate = due.toISOString().split('T')[0];

    const newCommission: Commission = {
      ...data,
      id: newId,
      status: 'pending',
      date: today,
      dueDate: dueDate,
      note: 'Will review within 2 business days.'
    };

    commissions = [newCommission, ...commissions];
    return newCommission;
  },

  updateCommissionStatus: (id: string, status: Status) => {
    const idx = commissions.findIndex(c => c.id === id);
    if (idx !== -1) {
      commissions[idx] = { ...commissions[idx], status };
      return true;
    }
    return false;
  },

  incrementMar9Interactions: () => {
    const targetDate = 'Mar 09';
    const idx = interactions.findIndex(i => i.date === targetDate);

    if (idx !== -1) {
      // Reassign to trigger reactivity if it's being watched (or just mutate if not)
      const updated = { ...interactions[idx] };
      updated.links += 10;
      updated.projects += 1;
      updated.commissions += 1;
      interactions[idx] = updated;
      interactions = [...interactions]; // Atomic update for reactivity
    } else {
      // Insert Mar 09 between Mar 08 and Mar 10
      const mar8Idx = interactions.findIndex(i => i.date === 'Mar 08');
      const newInteraction = { date: targetDate, links: 1, projects: 1, commissions: 1 };

      if (mar8Idx !== -1) {
        interactions.splice(mar8Idx + 1, 0, newInteraction);
        interactions = [...interactions];
      } else {
        interactions = [...interactions, newInteraction];
      }
    }
  },

  getAdminStats: () => {
    const total = commissions.length;
    const active = commissions.filter(c => c.status === 'active').length;
    const completed = commissions.filter(c => c.status === 'completed').length;

    // Revenue mock logic: $800 per completed commission
    const revenue = completed * 800;

    // Simulate bar chart data by aggregating last 6 months 
    // For simplicity of the mock, we just generate random-looking data that makes sense.
    const monthNames = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
    const chartData = monthNames.map(month => ({
      month,
      value: Math.floor(Math.random() * 8) + 1
    }));
    // Override the last month to be exact pending + active for visual correctness
    chartData[5].value = commissions.filter(c => c.status === 'active' || c.status === 'pending').length;

    return {
      total,
      active,
      revenue,
      chartData,
      recentActivity: commissions.slice(0, 5) // Last 5
    };
  }
};
