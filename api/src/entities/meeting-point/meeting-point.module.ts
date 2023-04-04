import { Module } from '@nestjs/common';
import { MeetingPointController } from './controller/meeting-point.controller';
import { MeetingPointService } from './service/meeting-point.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingPoint } from './models/meeting-point.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingPoint])],
  controllers: [MeetingPointController],
  providers: [MeetingPointService],
})
export class MeetingPointModule {}
