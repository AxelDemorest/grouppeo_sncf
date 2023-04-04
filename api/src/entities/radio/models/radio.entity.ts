import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Radio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: string;
}
