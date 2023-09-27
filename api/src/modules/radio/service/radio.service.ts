import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Radio, RadioUserType } from '../models/radio.entity';
import { createRadioDTO, RadioDTO } from '../models/radio.dto';

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

  async findRadioByAgentNumber(agentNumber: number): Promise<Radio> {
    return this.radioRepository.findOne({
      where: { agentNumber: agentNumber },
    });
  }

  async getRadiosForType(type: RadioUserType) {
    return await this.radioRepository.find({ where: { type: type } });
  }

  async updateRadio(id: number, updateData: RadioDTO): Promise<Radio> {
    const existingRadio = await this.radioRepository.findOne({ where: { id } });

    if (!existingRadio) {
      throw new NotFoundException(`Radio with ID ${id} not found`);
    }

    return await this.radioRepository.save({
      ...existingRadio,
      ...updateData,
    });
  }
}
