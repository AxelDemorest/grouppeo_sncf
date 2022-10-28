import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Train } from "src/entities/train/models/train.entity";
import { DataSource, Repository } from "typeorm";
import { createGroupDTO, GroupDTO } from "../models/group.dto";
import { Group } from "../models/group.entity";

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
}