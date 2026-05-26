import { AppDataSource } from './src/data-source';
import { ProjectEntity } from './src/entities/Project';
import { TagEntity } from './src/entities/Tag';
import { CommissionEntity } from './src/entities/Commission';
import { InteractionEntity } from './src/entities/Interaction';
import { v4 as uuidv4 } from 'uuid';

const SEED_COMMISSIONS = [
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

const SEED_INTERACTIONS = [
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

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log("Data Source initialized for seeding...");

    // Seed Commissions
    const commissionRepo = AppDataSource.getRepository(CommissionEntity);
    for (const c of SEED_COMMISSIONS) {
      const existing = await commissionRepo.findOneBy({ id: c.id });
      if (!existing) {
        const commission = commissionRepo.create(c);
        await commissionRepo.save(commission);
      }
    }
    console.log("Seeded Commissions");

    // Seed Projects
    const projectRepo = AppDataSource.getRepository(ProjectEntity);
    const tagRepo = AppDataSource.getRepository(TagEntity);

    for (const raw of SEED_PROJECTS_RAW) {
      const existingProject = await projectRepo.findOneBy({ title: raw.title });
      if (!existingProject) {
        // Find or create tags
        const tags = [];
        for (const tagName of raw.tags) {
          let tag = await tagRepo.findOneBy({ name: tagName });
          if (!tag) {
            tag = tagRepo.create({ name: tagName });
            await tagRepo.save(tag);
          }
          tags.push(tag);
        }

        const project = projectRepo.create({
          id: uuidv4(),
          title: raw.title,
          type: raw.type,
          desc: raw.desc,
          image: raw.image,
          imageAlt: raw.imageAlt,
          tags: tags
        });

        await projectRepo.save(project);
      }
    }
    console.log("Seeded Projects");

    // Seed Interactions
    const interactionRepo = AppDataSource.getRepository(InteractionEntity);
    for (const i of SEED_INTERACTIONS) {
      const existing = await interactionRepo.findOneBy({ date: i.date });
      if (!existing) {
        const interaction = interactionRepo.create(i);
        await interactionRepo.save(interaction);
      }
    }
    console.log("Seeded Interactions");

    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error during seeding", err);
    process.exit(1);
  }
}

seed();
