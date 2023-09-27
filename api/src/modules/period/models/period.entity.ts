import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Train } from '../../train/models/train.entity';

@Entity()
export class Period {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Train, (train) => train.train_period, {
    nullable: true,
    cascade: true,
  })
  trains: Train[];
}
