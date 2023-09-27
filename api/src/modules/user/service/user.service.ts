import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository, UpdateResult } from 'typeorm';
import { userDTO } from '../models/user.dto';
import { User, UserType } from '../models/user.entity';
import { generate } from 'generate-password';
import * as bcrypt from 'bcryptjs';
import { MailsService } from '../../mails/service/mails.service';
import * as moment from 'moment/moment';
import { RadioService } from '../../radio/service/radio.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(MailsService)
    private readonly mailsService: MailsService,
    @Inject(RadioService)
    private readonly radioService: RadioService,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async createUser(user: userDTO): Promise<User> {
    const salt = await bcrypt.genSalt();
    user.user_password = await bcrypt.hash(user.user_password, salt);
    const createUser = this.usersRepository.create(user);
    await this.usersRepository.save(createUser);
    return createUser;
  }

  async findUserById(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({ user_id: id });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({ user_mail: email });
  }

  async getUsers(): Promise<User[]> {
    return this.usersRepository.findBy({ user_type: Not(UserType.AGENT) });
  }

  async getAgents(): Promise<User[]> {
    return await this.usersRepository.findBy({ user_type: UserType.AGENT });
  }

  async getDPXByCp(user_cp: string): Promise<User> {
    return await this.usersRepository.findOneBy({
      user_type: UserType.DPX,
      user_cp: user_cp,
    });
  }

  async updateUser(user_id: number, data: userDTO): Promise<User> {
    const user = await this.usersRepository.findOneBy({ user_id: user_id });

    if (!user) {
      throw new NotFoundException(`User with ID=${user_id} not found`);
    }

    delete data.user_id;

    await this.usersRepository.update(user_id, data);

    return data;
  }

  async removeUser(id: string): Promise<any> {
    return this.usersRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('user_id = :id', { id })
      .execute();
  }

  // DAYS

  async createUserDay(user: User, date: string): Promise<UpdateResult> {
    const fetchUser: User = await this.findUserById(user.user_id);
    const formatDate = date.replace(new RegExp('-', 'g'), '/');

    if (!fetchUser) return;
    else {
      if (!fetchUser.user_days) fetchUser.user_days = [];
      if (fetchUser.user_days.includes(formatDate)) return;
      else {
        fetchUser.user_days.push(formatDate);
        return this.usersRepository
          .createQueryBuilder('user')
          .update(User)
          .set({
            user_days: fetchUser.user_days,
          })
          .where('user_id = :user_id', {
            user_id: user.user_id,
          })
          .execute();
      }
    }
  }

  async getAgentsFromDay(day: string): Promise<User[]> {
    const formatDate = day ? day : moment(new Date()).format('DD/MM/YYYY');

    return await this.usersRepository
      .createQueryBuilder('user')
      .where('user.user_days like :user_days', {
        user_days: `%${formatDate}%`,
      })
      .getMany();
  }

  async getAgentCountFromDay(day: string): Promise<number> {
    const formatDate = day.replace(new RegExp('-', 'g'), '/');

    return await this.usersRepository
      .createQueryBuilder('user')
      .where('user.user_days like :user_days', {
        user_days: `%${formatDate}%`,
      })
      .getCount();
  }

  async getUsersFromPlanning(planning_date: string) {
    const formatDate = planning_date.replace(new RegExp('-', 'g'), '/');

    return await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.user_planning', 'planning')
      .where('planning.planning_day = :planning_day', {
        planning_day: formatDate,
      })
      .getMany();
  }

  async getUsersCountsForNext5Days(): Promise<
    { id: number; date: string; count: number }[]
  > {
    const currentDate = moment();
    const userCounts = [];
    for (let i = 0; i < 10; i++) {
      const date = moment(currentDate).add(i, 'days').format('DD/MM/YYYY');
      const count = await this.getAgentCountFromDay(date);
      userCounts.push({ id: i + 1, date: date, count });
    }

    return userCounts;
  }

  async assignRadioToUser(body: {
    user_cp: string;
    radio_number: string;
  }): Promise<UpdateResult> {
    const radio = await this.radioService.getRadioByNumber(body.radio_number);
    const user = await this.getDPXByCp(body.user_cp);
    if (!radio || !user) return;

    return this.usersRepository
      .createQueryBuilder('user')
      .update(User)
      .set({
        user_radio: radio,
      })
      .where('user_id = :user_id', {
        user_id: user.user_id,
      })
      .execute();
  }

  async changePassword(id: string, password: string) {
    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);
    return await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ user_password: password, confirmed: true })
      .where('user_id = :user_id', { user_id: id })
      .execute();
  }
}
