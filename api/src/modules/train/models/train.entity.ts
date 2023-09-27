import { Group } from 'src/modules/group/models/group.entity';
import { Period } from '../../period/models/period.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Train {
  @PrimaryGeneratedColumn()
  train_id: number;

  @Column({ default: null })
  train_number: string;

  @Column({ default: null })
  train_date: string;

  @Column({ default: null })
  train_hour: string;

  @Column({ default: null })
  train_track: string;

  @ManyToOne(() => Period, (period) => period.trains, {
    onDelete: 'SET NULL',
  })
  train_period: Period;

  @OneToMany(() => Group, (group) => group.group_train, {
    nullable: true,
    cascade: true,
  })
  train_groups: Group[];
}
