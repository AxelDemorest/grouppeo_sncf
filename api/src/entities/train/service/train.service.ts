import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createTrainDTO, formTrainDTO } from '../models/train.dto';
import { Train } from '../models/train.entity';

@Injectable()
export class TrainService {
  constructor(
    @InjectRepository(Train) private trainsRepository: Repository<Train>,
  ) {}

  async createTrains(data: formTrainDTO) {
    const createTrains = [];

    const enumGroupType = {
      AUT: 'autonome',
      ENF: 'enfant',
      HAN: 'handicapé',
    };

    for (const element of data.trains) {
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
        train_period,
        ...groupValues
      }: createTrainDTO = element;
      const trainElement = {
        train_number,
        train_hour,
        train_groups,
        train_date,
        train_period,
      };
      groupValues.group_type = enumGroupType[groupValues.group_type]
        ? enumGroupType[groupValues.group_type]
        : 'non défini';
      groupValues.group_is_supported =
        groupValues.group_meeting_point?.trim().toLowerCase() !== 'non';
      if (foundTrain) {
        foundTrain.train_groups.push(groupValues);
      } else {
        trainElement.train_period = data.period;
        trainElement.train_groups = [];
        trainElement.train_groups.push(groupValues);
        createTrains.push(trainElement);
      }
    }
    await this.trainsRepository.save(createTrains);
    return createTrains;
  }

  async findTrains(): Promise<Train[]> {
    return await this.trainsRepository.find({
      relations: {
        train_groups: true,
      },
    });
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

  async updateTrainsAndGroups(updates: formTrainDTO): Promise<any> {
    return await this.trainsRepository
      .createQueryBuilder('train')
      .delete()
      .from(Train)
      .where('train_period = :train_period', {
        train_period: updates.period,
      })
      .execute();
  }

  async findTrainsOfOneDayWithSupportedGroups(date: string): Promise<Train[]> {
    const formatDate = date.replace(new RegExp('-', 'g'), '/');

    return await this.trainsRepository
      .createQueryBuilder('train')
      .leftJoinAndSelect('train.train_groups', 'group')
      .where('train.train_date = :train_date', {
        train_date: formatDate,
      })
      .andWhere('group.group_is_supported = :group_is_supported', {
        group_is_supported: true,
      })
      .getMany();
  }
}
