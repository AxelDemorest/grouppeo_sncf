import { Radio } from '../../radio/models/radio.entity';

export class meetingPointDTO {
  id: number;
}

export class createMeetingPointDTO {
  name: string;
  radio?: Radio;
}
