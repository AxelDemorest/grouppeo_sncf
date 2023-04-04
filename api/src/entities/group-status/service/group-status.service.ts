import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupStatus } from '../models/group-status.entity';
import { Group } from '../../group/models/group.entity';
import { Status } from '../../status/models/status.entity';

@Injectable()
export class GroupStatusService {
  constructor(
    @InjectRepository(GroupStatus)
    private groupStatusRepository: Repository<GroupStatus>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ) {}

  async findStatusByGroupId(groupId: number): Promise<GroupStatus[]> {
    return await this.groupStatusRepository.find({
      where: { group: { group_id: groupId } },
      relations: ['status'],
    });
  }

  async createGroupStatus(
    groupId: number,
    statusId: number,
  ): Promise<GroupStatus> {
    const group = await this.groupRepository.findOne({
      where: { group_id: groupId },
    });

    const status = await this.statusRepository.findOne({
      where: { id: statusId },
    });

    const groupStatus = new GroupStatus();
    groupStatus.group = group;
    groupStatus.status = status;

    return this.groupStatusRepository.save(groupStatus);
  }
}
