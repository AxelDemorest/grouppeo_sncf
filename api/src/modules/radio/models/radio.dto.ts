import { RadioUserType } from './radio.entity';

export class RadioDTO {
  id: number;
  number: string;
  name: number;
  type: RadioUserType;
}

export class createRadioDTO {
  number: string;
  agentNumber: number;
  type: RadioUserType;
}
