import { AppDataSource } from '../src/data-source';
import { ProjectEntity } from '../src/entities/Project';
import { CommissionEntity } from '../src/entities/Commission';
import { InteractionEntity } from '../src/entities/Interaction';
import { TagEntity } from '../src/entities/Tag';
import { v4 as uuidv4 } from 'uuid';

export async function setupTestDB() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  // Clear tables
  await AppDataSource.query(`DELETE FROM project_tags`);
  await AppDataSource.query(`DELETE FROM commissions`);
  await AppDataSource.query(`DELETE FROM interactions`);
  await AppDataSource.query(`DELETE FROM projects`);
  await AppDataSource.query(`DELETE FROM tags`);

  // Seed Projects
  const projectRepo = AppDataSource.getRepository(ProjectEntity);
  await projectRepo.save([
    { id: uuidv4(), title: 'Project 1', type: 'SaaS', desc: 'desc 1', image: 'img1.png', imageAlt: 'alt 1' },
    { id: uuidv4(), title: 'Project 2', type: 'Mobile', desc: 'desc 2', image: 'img2.png', imageAlt: 'alt 2' },
    { id: uuidv4(), title: 'Project 3', type: 'Web', desc: 'desc 3', image: 'img3.png', imageAlt: 'alt 3' },
  ]);

  // Seed Commissions
  const commRepo = AppDataSource.getRepository(CommissionEntity);
  await commRepo.save([
    { id: 'COM-001', client: 'Alex M.', title: 'T1', appType: 'Web', status: 'active', date: '2026-03-20', dueDate: '2026-04-15' },
    { id: 'COM-002', client: 'Sarah K.', title: 'T2', appType: 'Web', status: 'pending', date: '2026-03-20', dueDate: '2026-04-15' },
    { id: 'COM-003', client: 'User3', title: 'T3', appType: 'Web', status: 'completed', date: '2026-03-20', dueDate: '2026-04-15' },
    { id: 'COM-004', client: 'User4', title: 'T4', appType: 'Web', status: 'overdue', date: '2026-03-20', dueDate: '2026-04-15' },
    { id: 'COM-005', client: 'User5', title: 'T5', appType: 'Web', status: 'active', date: '2026-03-20', dueDate: '2026-04-15' },
    { id: 'COM-006', client: 'User6', title: 'T6', appType: 'Web', status: 'pending', date: '2026-03-20', dueDate: '2026-04-15' },
  ]);

  // Seed Interactions
  const intRepo = AppDataSource.getRepository(InteractionEntity);
  await intRepo.save([
    { date: 'Mar 01', links: 120, projects: 150, commissions: 80 },
    { date: 'Mar 02', links: 10, projects: 10, commissions: 10 },
    { date: 'Mar 03', links: 10, projects: 10, commissions: 10 },
    { date: 'Mar 04', links: 10, projects: 10, commissions: 10 },
    { date: 'Mar 05', links: 10, projects: 10, commissions: 10 },
    { date: 'Mar 06', links: 10, projects: 10, commissions: 10 },
    { date: 'Mar 07', links: 10, projects: 10, commissions: 10 },
    { date: 'Mar 08', links: 10, projects: 10, commissions: 10 },
    { date: 'Mar 10', links: 10, projects: 10, commissions: 10 },
  ]);
}

export async function closeTestDB() {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
}
