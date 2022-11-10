import { Train } from 'src/entities/train/models/train.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
  group_meeting_date_time?: string;

  @Column({ default: null })
  group_meeting_point?: string;

  @Column({ default: null })
  group_agent?: string;

  @Column({ default: false })
  group_prestation?: boolean;

  @Column({ default: null })
  group_responsable_departure_day?: string;

  @Column({ default: null })
  group_responsable_phone_departure_day?: string;

  @Column({ default: null })
  group_responsable?: string;

  @Column({ default: null })
  group_responsable_phone?: string;

  @Column({ default: null })
  group_seller_name?: string;

  @Column({ default: null })
  group_seller_phone?: string;

  @Column({ default: null })
  group_dpx?: string;

  @Column({ type: 'enum', enum: GroupReservationState, default: null })
  group_reservation_state?: GroupReservationState;

  @Column({ type: 'enum', enum: GroupOperationState, default: null })
  group_operation_state?: GroupOperationState;

  @Column({ default: null })
  group_comment?: string;

  @Column({ default: null })
  group_bus_number?: string;

  @Column({ default: null })
  group_is_supported?: boolean;

  @ManyToOne(() => Train, (train) => train.train_groups, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  group_train?: Train;
}
