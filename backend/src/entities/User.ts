import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 100 })
  username!: string;

  @Column({ length: 255 })
  email!: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash!: string;

  @Column({ length: 20, default: 'client' })
  role!: 'admin' | 'client';

  @Column({ name: 'created_at', type: 'datetime', default: () => 'GETDATE()' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'datetime', default: () => 'GETDATE()' })
  updatedAt!: Date;
}
