import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum RadioUserType {
  AGENT = 'agent',
  POINT = 'point',
  DPX = 'dpx',
}

@Entity()
export class Radio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: string;

  @Column({ nullable: true })
  dpx: string;

  @Column({ nullable: true })
  agentNumber: number;

  @Column({ type: 'enum', enum: RadioUserType })
  type: RadioUserType;
}
