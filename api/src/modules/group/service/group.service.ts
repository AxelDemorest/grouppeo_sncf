import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupDTO } from '../models/group.dto';
import { Group } from '../models/group.entity';
import * as moment from 'moment';
import { PlanningService } from '../../planning/service/planning.service';
import { TrainService } from '../../train/service/train.service';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupsRepository: Repository<Group>,
    @Inject(PlanningService)
    private readonly planningService: PlanningService,
    @Inject(TrainService)
    private readonly trainsService: TrainService,
  ) {}

  async findSupportedGroups(date: string) {
    const formatDate = date.replace(new RegExp('-', 'g'), '/');

    return await this.groupsRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.group_train', 'train')
      .where('train.train_date = :train_date', { train_date: formatDate })
      .andWhere('group.group_is_supported = :group_is_supported', {
        group_is_supported: true,
      })
      .getMany();
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

  async getCountOfGroupsOfOneDay(date: string, supported = true) {
    const formatDate = date.replace(new RegExp('-', 'g'), '/');

    return await this.groupsRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.group_train', 'train')
      .where('train.train_date = :train_date', { train_date: formatDate })
      .andWhere('group.group_is_supported = :group_is_supported', {
        group_is_supported: supported,
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
      .andWhere('group.group_planning IS NOT NULL')
      .andWhere('group.group_is_supported = :group_is_supported', {
        group_is_supported: true,
      })
      .orderBy('train.train_hour', 'ASC')
      .getMany();
  }

  async findGroupsForMeetingPoint(day: string, group_meeting_point: string) {
    const formatDate = day.replace(new RegExp('-', 'g'), '/');

    const groups = await this.groupsRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.group_planning', 'planning')
      .leftJoinAndSelect('group.group_train', 'train')
      .where('train.train_date = :train_date', { train_date: formatDate })
      .andWhere('group.group_meeting_point = :group_meeting_point', {
        group_meeting_point: group_meeting_point,
      })
      .andWhere('group.group_is_supported = :group_is_supported', {
        group_is_supported: true,
      })
      .orderBy('train.train_hour', 'ASC')
      .getMany();

    groups.sort((a, b) => {
      const [aHours, aMinutes] = a.group_meeting_time.split(':');
      const [bHours, bMinutes] = b.group_meeting_time.split(':');

      // Comparaison des heures
      if (parseInt(aHours) < parseInt(bHours)) {
        return -1;
      } else if (parseInt(aHours) > parseInt(bHours)) {
        return 1;
      }

      // Si les heures sont égales, comparer les minutes
      if (parseInt(aMinutes) < parseInt(bMinutes)) {
        return -1;
      } else if (parseInt(aMinutes) > parseInt(bMinutes)) {
        return 1;
      }

      // Si les heures et les minutes sont égales, garder l'ordre actuel
      return 0;
    });

    return groups;
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

  async updateTrainTrack(id: number, trainTrack: string) {
    const group = await this.groupsRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.group_train', 'train')
      .where('group.group_id = :id', { id })
      .getOne();

    if (!group) {
      throw new Error(`Group with id ${id} not found`);
    }
    group.group_train.train_track = trainTrack;
    return this.groupsRepository.save(group);
  }

  async findAllGroupsWithoutMeetingPoint(day: string) {
    const formatDate = day
      ? day.replace(new RegExp('-', 'g'), '/')
      : moment(new Date()).format('DD/MM/YYYY');

    return await this.groupsRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.group_train', 'train')
      .where('train.train_date = :train_date', { train_date: formatDate })
      .andWhere(
        'LENGTH(group.group_meeting_point) > 1 OR group.group_meeting_point IS NULL',
      )
      .andWhere('group.group_is_supported = :group_is_supported', {
        group_is_supported: true,
      })
      .getMany();
  }

  async findGroupsForPlanning(id: number) {
    return await this.groupsRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.group_planning', 'planning')
      .leftJoinAndSelect('group.group_train', 'train')
      .where('planning.planning_id = :planning_id', { planning_id: id })
      .getMany();
  }

  async findGroupsForAgent() {
    return await this.groupsRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.group_planning', 'planning')
      .where('planning.agentNumber = :agentNumber', {
        agentNumber: '6',
      })
      .getMany();
  }

  async findGroupsForPlanningAndAgent(day: string, number: string) {
    const formatDate = day.replace(new RegExp('-', 'g'), '/');

    return await this.groupsRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.group_planning', 'planning')
      .leftJoinAndSelect('group.group_train', 'train')
      .leftJoinAndSelect('planning.planning_user', 'user')
      .where('planning.planning_day = :planning_day', {
        planning_day: formatDate,
      })
      .andWhere('planning.agentNumber = :agentNumber', {
        agentNumber: number,
      })
      .orderBy('train.train_hour', 'ASC')
      .getMany();
  }

  async removePlanningFromGroup(groupId: number) {
    try {
      const group = await this.groupsRepository.findOne({
        relations: ['group_planning'],
        where: { group_id: groupId },
      });

      if (!group) {
        throw new NotFoundException('Group not found');
      }

      if (!group.group_planning) {
        throw new NotFoundException(
          'Group is not associated with any planning',
        );
      }

      group.group_planning = null;
      await this.groupsRepository.save(group);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getIsolatedGroupsOfPlanning(date: string) {
    const day = date.replace(new RegExp('-', 'g'), '/');

    return await this.groupsRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.group_train', 'train')
      .leftJoinAndSelect('group.group_planning', 'planning')
      .leftJoinAndSelect('planning.planning_user', 'user')
      .where('train.train_date = :train_date', { train_date: day })
      .andWhere('group.group_planning IS NULL')
      .andWhere('group.group_is_supported = :group_is_supported', {
        group_is_supported: true,
      })
      .orderBy('train.train_hour', 'ASC')
      .getMany();
  }

  async assignPlanningToGroup(
    groupId: number,
    planningId: number,
  ): Promise<void> {
    const group = await this.groupsRepository.findOne({
      relations: ['group_planning'],
      where: { group_id: groupId },
    });
    if (!group) {
      throw new NotFoundException('Groupe introuvable');
    }

    const planning = await this.planningService.findPlanningById(planningId);
    if (!planning) {
      throw new NotFoundException('Planning introuvable');
    }

    group.group_planning = planning;
    await this.groupsRepository.save(group);
  }

  async createGroup(groupData: GroupDTO) {
    let train = await this.trainsService.findTrainByNumber(
      groupData.group_train.train_number,
      groupData.group_train.train_date,
    );

    if (!train) {
      train = await this.trainsService.createOneTrain(groupData.group_train);
    }

    groupData.group_train = train;

    const group = await this.groupsRepository.create(groupData);
    return await this.groupsRepository.save(group);
  }
}
