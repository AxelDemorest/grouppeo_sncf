import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Period } from '../models/period.entity';
import { periodDTO } from '../models/period.dto';

@Injectable()
export class PeriodService {
  constructor(
    @InjectRepository(Period)
    private periodRepository: Repository<Period>,
  ) {}

  async createPeriod(period: periodDTO) {
    const newPeriod = this.periodRepository.create(period);

    return this.periodRepository.save(newPeriod);
  }

  async getPeriods() {
    return await this.periodRepository.find();
  }
}
