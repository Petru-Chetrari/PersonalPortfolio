import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ProjectEntity } from './entities/Project';
import { TagEntity } from './entities/Tag';
import { CommissionEntity } from './entities/Commission';
import { InteractionEntity } from './entities/Interaction';
import { UserEntity } from './entities/User';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'ep-empty-star-a2p01mtk.eu-central-1.aws.neon.tech',
  database: 'neondb',
  driver: require('mssql/msnodesqlv8'),
  synchronize: false,
  logging: false,
  entities: [ProjectEntity, TagEntity, CommissionEntity, InteractionEntity, UserEntity],
  migrations: [__dirname + '/migrations/*.ts'],
  subscribers: [],
  extra: {
    connectionString: 'postgresql://neondb_owner:npg_fbBUOhW72dFz@ep-empty-star-a2p01mtk.eu-central-1.aws.neon.tech/neondb?sslmode=require'
  }
} as any);
