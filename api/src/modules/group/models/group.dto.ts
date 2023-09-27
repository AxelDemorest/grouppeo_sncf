import { Train } from 'src/modules/train/models/train.entity';
import {
  GroupType,
  GroupOperationState,
  GroupReservationState,
} from './group.entity';
import { Planning } from '../../planning/models/planning.entity';

export class GroupDTO {
  group_id: number;
  readonly group_name?: string;
  readonly group_type?: GroupType;
  readonly group_total_travellers?: string;
  readonly group_destination?: string;
  readonly group_car_number?: string;
  readonly group_meeting_time?: string;
  readonly group_meeting_point?: string;
  readonly group_agent?: string;
  readonly group_prestation?: boolean;
  readonly group_responsable_departure_day?: string;
  readonly group_responsable_phone_departure_day?: string;
  readonly group_mail?: string;
  readonly group_reservation_state?: GroupReservationState;
  readonly group_operation_state?: GroupOperationState;
  group_train?: Train;
  readonly group_is_supported?: boolean;
  readonly group_planning?: Planning;
}

export class createGroupDTO {
  readonly group_name: string;
  readonly group_type: GroupType;
  readonly group_total_travellers: number;
  readonly group_destination: string;
  readonly group_car_number: string;
  readonly group_meeting_date: Date;
  readonly group_meeting_time: Date;
  readonly group_meeting_point: string;
  readonly group_agent: string;
  readonly group_prestation: boolean;
  readonly group_responsable_departure_day: string;
  readonly group_responsable_phone_departure_day: string;
  readonly group_responsable: string;
  readonly group_responsable_phone: string;
  readonly group_seller_name: string;
  readonly group_seller_phone: string;
  readonly group_reservation_state: GroupReservationState;
  readonly group_operation_state: GroupOperationState;
  readonly train_number: number;
  readonly group_planning: Planning;
}
