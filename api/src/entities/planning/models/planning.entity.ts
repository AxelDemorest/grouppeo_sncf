import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/models/user.entity';
import { Group } from '../../group/models/group.entity';

@Entity()
export class Planning {
  @PrimaryGeneratedColumn()
  planning_id: number;

  @Column()
  start_time: string;

  @Column()
  end_time: string;

  @Column()
  planning_day: string;

  @ManyToOne(() => User, (user) => user.user_planning, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  planning_user: User;

  @OneToMany(() => Group, (group) => group.group_planning, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  planning_groups: Group[];
}
