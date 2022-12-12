import { UserType } from './user.entity';

export class userDTO {
  user_id: number;
  readonly user_cp: string;
  readonly user_mail: string;
  readonly user_first_name: string;
  readonly user_last_name: string;
  user_type: UserType;
  user_password: string;
}
