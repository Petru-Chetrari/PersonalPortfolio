import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ProjectEntity } from './entities/Project';
import { TagEntity } from './entities/Tag';
import { CommissionEntity } from './entities/Commission';
import { InteractionEntity } from './entities/Interaction';
import { UserEntity } from './entities/User';

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: 'DESKTOP-31NFAM7',
  database: 'PortfolioDB',
  driver: require('mssql/msnodesqlv8'),
  synchronize: false,
  logging: false,
  entities: [ProjectEntity, TagEntity, CommissionEntity, InteractionEntity, UserEntity],
  migrations: [__dirname + '/migrations/*.ts'],
  subscribers: [],
  extra: {
    connectionString: 'Server=DESKTOP-31NFAM7;Database=PortfolioDB;Trusted_Connection=yes;Driver={ODBC Driver 17 for SQL Server};'
  }
} as any);
