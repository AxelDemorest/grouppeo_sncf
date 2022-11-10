import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { createTrainDTO } from '../models/train.dto';
import { Train } from '../models/train.entity';

@Injectable()
export class TrainService {
  constructor(
    @InjectRepository(Train) private trainsRepository: Repository<Train>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async createTrains(trains: createTrainDTO[]) {
    const createTrains = [];

    const enumGroupType = {
      AUT: 'autonome',
      ENF: 'enfant',
      HAN: 'handicapé',
    };

    for (const element of trains) {
      const foundTrain = createTrains.find(
        (row) =>
          row.train_number === element.train_number &&
          row.train_date === element.train_date,
      );
      const {
        train_number,
        train_hour,
        train_groups,
        train_date,
        ...groupValues
      }: createTrainDTO = element;
      const trainElement = {
        train_number,
        train_hour,
        train_groups,
        train_date,
      };
      groupValues.group_type = enumGroupType[groupValues.group_type]
        ? enumGroupType[groupValues.group_type]
        : 'non défini';
      if (groupValues.group_meeting_point?.trim().toLowerCase() !== 'non')
        groupValues.group_is_supported = true;
      else groupValues.group_is_supported = false;
      if (foundTrain) {
        foundTrain.train_groups.push(groupValues);
      } else {
        trainElement.train_groups = [];
        trainElement.train_groups.push(groupValues);
        createTrains.push(trainElement);
      }
    }
    await this.trainsRepository.save(createTrains);
    return createTrains;
  }

  async getAllTrainsWithoutSupportedGroups(): Promise<Train[]> {
    return this.trainsRepository
      .createQueryBuilder('train')
      .leftJoinAndSelect('train.train_groups', 'group')
      .where('group.group_is_supported = false')
      .getMany();
  }

  async getAllTrainsWithSupportedGroups(): Promise<Train[]> {
    return this.trainsRepository
      .createQueryBuilder('train')
      .leftJoinAndSelect('train.train_groups', 'group')
      .where('group.group_is_supported = true')
      .getMany();
  }
}
