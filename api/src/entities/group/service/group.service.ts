import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupDTO } from '../models/group.dto';
import { Group } from '../models/group.entity';
import * as moment from 'moment';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupsRepository: Repository<Group>,
  ) {}

  getGroups(): Promise<Group[]> {
    return this.groupsRepository.find();
  }

  getGroupById(group_id: number): Promise<Group> {
    return this.groupsRepository.findOneBy({ group_id: group_id });
  }

  async updateGroup(group_id: number, data: GroupDTO): Promise<GroupDTO> {
    const group = await this.groupsRepository.findOneBy({ group_id: group_id });

    if (!group) {
      throw new NotFoundException(`Group with ID=${group_id} not found`);
    }

    delete data.group_id;

    await this.groupsRepository.update(group_id, data);

    return data;
  }

  async updateType(group_id: number, data: GroupDTO) {
    return this.groupsRepository
      .createQueryBuilder('train')
      .update(Group)
      .set({ group_is_supported: !data.group_is_supported })
      .where('group_id = :group_id', { group_id: group_id })
      .execute();
  }

  async getCountOfGroupsOfOneDay(date: string) {
    const formatDate = date.replace(new RegExp('-', 'g'), '/');

    return await this.groupsRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.group_train', 'train')
      .where('train.train_date = :train_date', { train_date: formatDate })
      .andWhere('group.group_is_supported = :group_is_supported', {
        group_is_supported: true,
      })
      .getCount();
  }

  async getGroupsOfOnePlanningDay(date: string): Promise<Group[]> {
    const formatDate = date.replace(new RegExp('-', 'g'), '/');

    return await this.groupsRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.group_train', 'train')
      .leftJoinAndSelect('group.group_planning', 'planning')
      .leftJoinAndSelect('planning.planning_user', 'user')
      .where('train.train_date = :train_date', { train_date: formatDate })
      .andWhere('group.group_is_supported = :group_is_supported', {
        group_is_supported: true,
      })
      .getMany();
  }

  async findGroupsForMeetingPoint(day: string, group_meeting_point: string) {
    const formatDate = day.replace(new RegExp('-', 'g'), '/');

    return await this.groupsRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.group_planning', 'planning')
      .leftJoinAndSelect('group.group_train', 'train')
      .where('planning.planning_day = :planning_day', {
        planning_day: formatDate,
      })
      .andWhere('group.group_meeting_point = :group_meeting_point', {
        group_meeting_point: group_meeting_point,
      })
      .getMany();
  }

  async getGroupCountsForNext5Days(): Promise<
    { id: number; date: string; count: number }[]
  > {
    const currentDate = moment();
    const groupCounts = [];
    for (let i = 0; i < 10; i++) {
      const date = moment(currentDate).add(i, 'days').format('DD/MM/YYYY');
      const count = await this.getCountOfGroupsOfOneDay(date);
      groupCounts.push({ id: i + 1, date: date, count });
    }

    return groupCounts;
  }

  async getGroupsOfOneDay(date: string) {
    const formatDate = date
      ? date.replace(new RegExp('-', 'g'), '/')
      : moment(new Date()).format('DD/MM/YYYY');

    return await this.groupsRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.group_train', 'train')
      .leftJoinAndSelect('group.groupStatus', 'groupStatus')
      .leftJoinAndSelect('groupStatus.status', 'status')
      .where('train.train_date = :train_date', { train_date: formatDate })
      .andWhere('group.group_is_supported = :group_is_supported', {
        group_is_supported: true,
      })
      .getMany();
  }
}
