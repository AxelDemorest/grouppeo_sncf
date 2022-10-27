import { Train } from "src/entities/train/models/train.entity";
import { GroupType, GroupOperationState, GroupReservationState } from "./group.entity";

export class GroupDTO {
    readonly group_name: string;
    readonly group_type: GroupType;
    readonly group_total_travellers: number;
    readonly group_destination: string;
    readonly group_car_number: string;
    readonly group_meeting_date_time: string;
    readonly group_agent?: string;
    readonly group_prestation?: Boolean;
    readonly group_responsable_departure_day: string;
    readonly group_responsable_phone_departure_day: string;
    readonly group_responsable: string;
    readonly group_responsable_phone: string;
    readonly group_seller_name: string;
    readonly group_seller_phone: string;
    readonly group_dpx: string;
    readonly group_reservation_state: GroupReservationState;
    readonly group_operation_state: GroupOperationState;
    readonly group_comment: string;
    readonly group_bus_number: string;
    readonly group_train: Train;
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
    readonly group_prestation: Boolean;
    readonly group_responsable_departure_day: string;
    readonly group_responsable_phone_departure_day: string;
    readonly group_responsable: string;
    readonly group_responsable_phone: string;
    readonly group_seller_name: string;
    readonly group_seller_phone: string;
    readonly group_dpx: string;
    readonly group_reservation_state: GroupReservationState;
    readonly group_operation_state: GroupOperationState;
    readonly group_comment: string;
    readonly group_bus_number: string;
    readonly train_number: number;
}