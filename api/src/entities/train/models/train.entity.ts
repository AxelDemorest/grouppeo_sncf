import { Group } from 'src/entities/group/models/group.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToMany(() => Group, (group) => group.group_train, {
    nullable: true,
    cascade: true,
  })
  train_groups: Group[];
}
