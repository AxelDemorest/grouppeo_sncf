import { Module } from '@nestjs/common';
import { MeetingPointController } from './controller/meeting-point.controller';
import { MeetingPointService } from './service/meeting-point.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingPoint } from './models/meeting-point.entity';
import { Radio } from '../radio/models/radio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingPoint, Radio])],
  controllers: [MeetingPointController],
  providers: [MeetingPointService],
  exports: [MeetingPointService],
})
export class MeetingPointModule {}
