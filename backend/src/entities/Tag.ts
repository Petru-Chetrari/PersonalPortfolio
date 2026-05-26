import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { ProjectEntity } from './Project';

@Entity('tags')
export class TagEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @ManyToMany(() => ProjectEntity, project => project.tags)
  projects!: ProjectEntity[];
}
