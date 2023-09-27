import { Train } from 'src/modules/train/models/train.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Planning } from '../../planning/models/planning.entity';
import { GroupStatus } from '../../group-status/models/group-status.entity';

export enum GroupType {
  AUT = 'autonome',
  ENF = 'enfant',
  HAN = 'handicapé',
  UNDEFINED = 'non défini',
}

export enum GroupReservationState {
  APP = 'À appeler',
  CONF = 'Confirmée',
  ANN = 'Annulée',
  COU = 'En cours',
}

export enum GroupOperationState {
  ARR = 'Arrivé',
  PEC = 'Pris en charge',
  INS = 'Installé',
}

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  group_id?: number;

  @Column({ default: null })
  group_name?: string;

  @Column({ type: 'enum', enum: GroupType, default: null })
  group_type?: GroupType;

  @Column({ default: null })
  group_total_travellers?: string;

  @Column({ default: null })
  group_destination?: string;

  @Column({ default: null })
  group_car_number?: string;

  @Column({ default: null })
  group_meeting_time?: string;

  @Column({ default: null })
  group_meeting_point?: string;

  @Column({ default: false })
  group_prestation?: boolean;

  @Column({ default: null })
  group_responsable_departure_day?: string;

  @Column({ default: null })
  group_responsable_phone_departure_day?: string;

  @Column({ type: 'enum', enum: GroupReservationState, default: null })
  group_reservation_state?: GroupReservationState;

  @OneToMany(() => GroupStatus, (groupStatus) => groupStatus.group)
  groupStatus?: GroupStatus[];

  @Column({ default: null })
  group_mail?: string;

  @Column({ default: null })
  group_is_supported?: boolean;

  @ManyToOne(() => Train, (train) => train.train_groups, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  group_train?: Train;

  @ManyToOne(() => Planning, (planning) => planning.planning_groups, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  group_planning?: Planning;
}
