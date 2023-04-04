import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Planning } from '../../planning/models/planning.entity';
import { Radio } from '../../radio/models/radio.entity';

export enum UserType {
  ADMIN = 'Administrateur',
  UOSERV = 'UO service',
  DPX = 'DPX',
  AGENT = 'Agent',
  USER = 'Utilisateur',
}

/**
 * Class representing a User.
 *
 * @export
 * @class User
 */
@Entity()
export class User {
  /**
   * User's id, generated automatically by the database.
   *
   * @type {number}
   * @memberof User
   */
  @PrimaryGeneratedColumn()
  user_id: number;

  /**
   * User's sncf code.
   *
   * @type {string}
   * @memberof User
   */
  @Column()
  user_cp: string;

  /**
   * User's email.
   *
   * @type {string}
   * @memberof User
   */
  @Column()
  user_mail: string;

  /**
   * User's first name.
   *
   * @type {string}
   * @memberof User
   */
  @Column()
  user_first_name: string;

  /**
   * User's last name.
   *
   * @type {string}
   * @memberof User
   */
  @Column()
  user_last_name: string;

  /**
   * User's password.
   *
   * @type {string}
   * @memberof User
   */
  @Column()
  user_password: string;

  /**
   * User's type, with a default value of UserType.USER.
   *
   * @type {UserType}
   * @memberof User
   */
  @Column({ type: 'enum', enum: UserType, default: UserType.USER })
  user_type: UserType;

  /**
   * User's assigned days, represented as an array of strings.
   *
   * @type {(string | undefined)}
   * @memberof User
   */
  @Column({ type: 'simple-array', nullable: true })
  user_days?: string[];

  /**
   * User's planning, represented as an array of Planning entities.
   *
   * @type {(Planning[] | undefined)}
   * @memberof User
   */
  @OneToMany(() => Planning, (planning) => planning.planning_user, {
    nullable: true,
    cascade: true,
  })
  user_planning?: Planning[];

  @OneToOne(() => Radio, { nullable: true })
  @JoinColumn()
  user_radio?: Radio;
}
