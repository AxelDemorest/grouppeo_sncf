import { Injectable } from '@nestjs/common';
import {
  createMeetingPointDTO,
  UpdateMeetingPointDto,
} from '../models/meeting-point.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeetingPoint } from '../models/meeting-point.entity';
import { User } from '../../user/models/user.entity';
import { Radio } from '../../radio/models/radio.entity';

@Injectable()
export class MeetingPointService {
  constructor(
    @InjectRepository(MeetingPoint)
    private meetingPointRepository: Repository<MeetingPoint>,
    @InjectRepository(Radio)
    private radioRepository: Repository<Radio>,
  ) {}

  createMeetingPoint(meetingPoint: createMeetingPointDTO) {
    const newMeetingPoint = this.meetingPointRepository.create(meetingPoint);

    return this.meetingPointRepository.save(newMeetingPoint);
  }

  async getMeetingPoints() {
    return await this.meetingPointRepository.find({
      relations: {
        radio: true,
      },
    });
  }

  async deleteMeetingPoint(id: number) {
    return await this.meetingPointRepository
      .createQueryBuilder('meetingPoint')
      .delete()
      .from(MeetingPoint)
      .where('id = :id', { id })
      .execute();
  }

  async updateMeetingPoint(
    id: number,
    updateMeetingPointDto: UpdateMeetingPointDto,
  ): Promise<MeetingPoint> {
    const meetingPoint = await this.meetingPointRepository.findOne({
      relations: ['radio'],
      where: { id },
    });

    if (updateMeetingPointDto.name) {
      meetingPoint.name = updateMeetingPointDto.name;
    }
    if (updateMeetingPointDto.radioId) {
      const newRadio = await this.radioRepository.findOne({
        where: {
          id: updateMeetingPointDto.radioId,
        },
      });

      if (newRadio) {
        // Si la radios est déjà attachée à un autre meeting point, on la détache
        const currentMeetingPoint = await this.meetingPointRepository.findOne({
          where: { radio: newRadio },
        });
        if (currentMeetingPoint) {
          currentMeetingPoint.radio = null;
          await this.meetingPointRepository.save(currentMeetingPoint);
        }

        // On attache la radios au nouveau meeting point
        meetingPoint.radio = newRadio;
      }
    }

    return this.meetingPointRepository.save(meetingPoint);
  }

  async getMeetingPoint(name: string) {
    return await this.meetingPointRepository.findOne({
      where: { name: name },
      relations: ['radio'],
    });
  }
}
