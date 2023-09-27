import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  createTrainDTO,
  formTrainDTO,
  TrainDTO,
  UpdateTrainDTO,
} from '../models/train.dto';
import { Train } from '../models/train.entity';
import { PeriodService } from '../../period/service/period.service';
import { Period } from '../../period/models/period.entity';
import { MeetingPointService } from '../../meeting-point/service/meeting-point.service';

@Injectable()
export class TrainService {
  constructor(
    @InjectRepository(Train)
    private trainsRepository: Repository<Train>,
    @Inject(PeriodService)
    private readonly periodService: PeriodService,
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
      // TODO : Faire aussi quand la case est vide
      groupValues.group_is_supported =
        groupValues.group_meeting_point?.trim().toLowerCase() !== 'non';
      if (foundTrain) {
        foundTrain.train_groups.push(groupValues);
      } else {
        const period = await this.periodService.findPeriodByName(data.period);
        if (!period) {
          const newPeriod = new Period();
          newPeriod.name = data.period;
          trainElement.train_period = await this.periodService.createPeriod(
            newPeriod,
          );
        } else trainElement.train_period = period;
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

  async getAllTrainsWithoutSupportedGroups(period?: string): Promise<Train[]> {
    let query = this.trainsRepository
      .createQueryBuilder('train')
      .leftJoinAndSelect('train.train_groups', 'group')
      .leftJoinAndSelect('train.train_period', 'period')
      .where('group.group_is_supported = false');

    if (period) {
      query = query.andWhere('period.name = :period', { period });
    }

    return query.getMany();
  }

  async getAllTrainsWithSupportedGroups(): Promise<Train[]> {
    return this.trainsRepository
      .createQueryBuilder('train')
      .leftJoinAndSelect('train.train_groups', 'group')
      .where('group.group_is_supported = true')
      .getMany();
  }

  async updateTrainsAndGroups(updates: formTrainDTO): Promise<any> {
    const period = await this.periodService.findPeriodByName(updates.period);
    if (!period) {
      throw new Error('Period not found');
    }

    const trains = await this.trainsRepository
      .createQueryBuilder('train')
      .leftJoinAndSelect('train.train_period', 'period')
      .where('period.id = :periodId', { periodId: period.id })
      .getMany();

    const trainIds = trains.map((train) => train.train_id);
    await this.trainsRepository.delete(trainIds);
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

  async updateTrainById(id: number, updateData: UpdateTrainDTO): Promise<void> {
    const existingTrain = await this.trainsRepository.findOne({
      where: { train_id: id },
    });

    if (!existingTrain) {
      throw new NotFoundException(`Train with ID ${id} not found`);
    }

    await this.trainsRepository.update(id, updateData);
  }

  async getTrainOfOneDay(day: string) {
    const formatDate = day.replace(new RegExp('-', 'g'), '/');

    return await this.trainsRepository
      .createQueryBuilder('train')
      .leftJoinAndSelect('train.train_groups', 'group')
      .leftJoinAndSelect('group.groupStatus', 'groupStatus')
      .leftJoinAndSelect('group.group_planning', 'planning')
      .leftJoinAndSelect('groupStatus.status', 'status')
      .where('train.train_date = :train_date', { train_date: formatDate })
      .orderBy('train.train_hour', 'ASC')
      .getMany();
  }

  async findTrainByNumber(number: string, date: string) {
    const formatDate = date.replace(new RegExp('-', 'g'), '/');

    return await this.trainsRepository.findOne({
      where: { train_number: number, train_date: formatDate },
    });
  }

  async createOneTrain(data: TrainDTO) {
    const train = await this.trainsRepository.create(data);
    return await this.trainsRepository.save(train);
  }
}
