import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupDTO } from '../models/group.dto';
import { Group } from '../models/group.entity';

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

  async updateGroup(group_id: number, data: GroupDTO): Promise<Group> {
    const group = await this.groupsRepository.findOneBy({ group_id: group_id });

    if (!group) {
      throw new NotFoundException(`Group with ID=${group_id} not found`);
    }

    delete data.group_id;

    await this.groupsRepository.update(group_id, data);

    return data;
  }
}
