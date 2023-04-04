import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { GroupStatus } from '../../group-status/models/group-status.entity';

@Entity()
export class Status {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => GroupStatus, (groupStatus) => groupStatus.group)
  status_group: GroupStatus[];
}
