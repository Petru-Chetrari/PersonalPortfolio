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

// In-memory state (survives Astro View Transition navigation but resets on hard refresh)
let commissions: Commission[] = [
  { id: 'COM-001', client: 'Alex M.', title: 'Portfolio Website Redesign', appType: 'Web App', status: 'active', date: '2026-03-20', dueDate: '2026-04-15', note: 'Wire-frames sent, awaiting feedback on hero section.' },
  { id: 'COM-002', client: 'Sarah K.', title: 'E-commerce Dashboard', appType: 'Web App', status: 'pending', date: '2026-03-28', dueDate: '2026-04-30', note: 'Will review within 2 business days.' },
  { id: 'COM-003', client: 'Jordan T.', title: 'Mobile App UI Design', appType: 'Mobile App', status: 'completed', date: '2026-03-01', dueDate: '2026-03-25', note: 'All deliverables sent. Great working with you!' },
  { id: 'COM-004', client: 'Priya S.', title: 'SaaS Landing Page', appType: 'Marketing', status: 'overdue', date: '2026-02-15', dueDate: '2026-03-10' },
  { id: 'COM-005', client: 'Marco R.', title: 'Brand Identity System', appType: 'Design', status: 'active', date: '2026-03-22', dueDate: '2026-04-20' },
  { id: 'COM-006', client: 'Liu W.', title: 'Admin Panel Overhaul', appType: 'Web App', status: 'pending', date: '2026-03-30', dueDate: '2026-05-01' },
];

export const MockRepository = {
  getCommissions: () => {
    return [...commissions];
  },
  
  getClientCommissions: (clientName = 'Current User') => {
    // For mock purposes, standardizing some commissions as "My" commissions, plus any new ones added.
    return commissions.filter(c => c.client === clientName || c.client === 'Alex M.' || c.client === 'Sarah K.' || c.client === 'Jordan T.');
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
