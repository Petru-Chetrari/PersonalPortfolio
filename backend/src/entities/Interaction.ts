import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('interactions')
export class InteractionEntity {
  @PrimaryColumn()
  date!: string;

  @Column('int', { default: 0 })
  links!: number;

  @Column('int', { default: 0 })
  projects!: number;

  @Column('int', { default: 0 })
  commissions!: number;
}
