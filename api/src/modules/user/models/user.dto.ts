import { UserType } from './user.entity';
import { Planning } from '../../planning/models/planning.entity';
import { Radio } from '../../radio/models/radio.entity';

export class userDTO {
  user_id?: number;
  user_cp: string;
  user_mail: string;
  user_first_name: string;
  user_last_name: string;
  user_type: UserType;
  user_password: string;
  user_days?: string[];
  user_planning?: Planning[];
  user_radio?: Radio;
  confirmed: boolean;
}
