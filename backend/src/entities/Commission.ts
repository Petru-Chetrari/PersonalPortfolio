import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('commissions')
export class CommissionEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  client!: string;

  @Column()
  title!: string;

  @Column()
  appType!: string;

  @Column()
  status!: string;

  @Column()
  date!: string;

  @Column()
  dueDate!: string;

  @Column({ nullable: true })
  note?: string;

  @Column({ nullable: true })
  budget?: string;

  @Column({ nullable: true })
  shortDesc?: string;

  @Column({ nullable: true })
  longDesc?: string;

  // Trigger will update this
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;
}
