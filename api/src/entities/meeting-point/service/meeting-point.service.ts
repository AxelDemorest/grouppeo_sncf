import { Injectable } from '@nestjs/common';
import { createMeetingPointDTO } from '../models/meeting-point.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeetingPoint } from '../models/meeting-point.entity';
import { User } from '../../user/models/user.entity';

@Injectable()
export class MeetingPointService {
  constructor(
    @InjectRepository(MeetingPoint)
    private meetingPointRepository: Repository<MeetingPoint>,
  ) {}

  createMeetingPoint(meetingPoint: createMeetingPointDTO) {
    const newMeetingPoint = this.meetingPointRepository.create(meetingPoint);

    return this.meetingPointRepository.save(newMeetingPoint);
  }

  async getMeetingPoints() {
    return await this.meetingPointRepository.find();
  }

  async deleteMeetingPoint(id: number) {
    return await this.meetingPointRepository
      .createQueryBuilder('meetingPoint')
      .delete()
      .from(MeetingPoint)
      .where('id = :id', { id })
      .execute();
  }
}
