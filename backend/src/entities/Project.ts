import { Entity, PrimaryColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { TagEntity } from './Tag';

@Entity('projects')
export class ProjectEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  title!: string;

  @Column()
  type!: string;

  @Column('text')
  desc!: string;

  @Column()
  image!: string;

  @Column()
  imageAlt!: string;

  @ManyToMany(() => TagEntity, tag => tag.projects, { cascade: true, eager: true })
  @JoinTable({ name: 'project_tags' })
  tags!: TagEntity[];

  // Trigger will update this
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;
}
