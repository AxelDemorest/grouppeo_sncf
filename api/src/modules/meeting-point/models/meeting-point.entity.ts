import {
  Column,
  JoinColumn,
  OneToOne,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Radio } from '../../radio/models/radio.entity';

@Entity()
export class MeetingPoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => Radio, { nullable: true })
  @JoinColumn()
  radio?: Radio;
}
