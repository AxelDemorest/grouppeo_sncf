import { Group, GroupType } from "src/entities/group/models/group.entity";

export class TrainDTO {
    readonly train_id?: number;
    readonly train_number: number;
    readonly train_date: string;
    readonly train_hour: number;
    readonly train_track?: string;
    readonly train_groups?: Group[];
}

export class createTrainDTO {
    readonly train_number: number;
    readonly train_hour: number;
    train_groups: Group[];
    readonly train_date: string;
    readonly group_name: string;
    readonly group_type: GroupType;
    readonly group_total_travellers: string;
    readonly group_destination: string;
    readonly group_car_number: string;
    readonly group_meeting_date_time: string;
    readonly group_meeting_point: string;
    readonly group_prestation?: Boolean;
    readonly group_responsable_departure_day?: string;
    readonly group_responsable_phone_departure_day?: string;
    readonly group_responsable?: string;
    readonly group_responsable_phone?: string;
    readonly group_seller_name?: string;
    readonly group_seller_phone?: string;
    readonly group_dpx?: string;
    readonly group_comment?: string;
    readonly group_bus_number?: string;
}

