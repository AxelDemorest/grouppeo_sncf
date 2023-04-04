import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Group } from '../../group/models/group.entity';
import { Status } from '../../status/models/status.entity';

@Entity()
export class GroupStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Group, (group) => group.groupStatus)
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @ManyToOne(() => Status, (status) => status.status_group)
  @JoinColumn({ name: 'status_id' })
  status: Status;

  @Column({ default: true })
  validated?: boolean;
}
