import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Radio } from '../models/radio.entity';
import { createRadioDTO } from '../models/radio.dto';

@Injectable()
export class RadioService {
  constructor(
    @InjectRepository(Radio)
    private radioRepository: Repository<Radio>,
  ) {}

  async createRadio(radio: createRadioDTO) {
    const newRadio = this.radioRepository.create(radio);

    return this.radioRepository.save(newRadio);
  }

  getRadioByNumber(number: string) {
    return this.radioRepository.findOne({ where: { number } });
  }

  async getRadios() {
    return await this.radioRepository.find();
  }

  async deleteRadio(id: number) {
    return await this.radioRepository
      .createQueryBuilder()
      .delete()
      .from(Radio)
      .where('id = :id', { id })
      .execute();
  }
}
