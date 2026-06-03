import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ProjectEntity } from './entities/Project';
import { TagEntity } from './entities/Tag';
import { CommissionEntity } from './entities/Commission';
import { InteractionEntity } from './entities/Interaction';
import { UserEntity } from './entities/User';

const databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_fbBUOhW72dFz@ep-empty-star-a2p01mtk.eu-central-1.aws.neon.tech/neondb?sslmode=require';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  ssl: { rejectUnauthorized: false }, // Required for secure connections to Neon/Supabase
  synchronize: true, // Automatically creates database tables matching entities
  logging: false,
  entities: [ProjectEntity, TagEntity, CommissionEntity, InteractionEntity, UserEntity],
  migrations: [],
  subscribers: [],
} as any);
