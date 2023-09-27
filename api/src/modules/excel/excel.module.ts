import { Module } from '@nestjs/common';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';
import { PlanningModule } from '../planning/planning.module';
import { GroupModule } from '../group/group.module';
import { MeetingPointModule } from '../meeting-point/meeting-point.module';
import { RadioModule } from '../radio/radio.module';

@Module({
  imports: [PlanningModule, GroupModule, MeetingPointModule, RadioModule],
  controllers: [ExcelController],
  providers: [ExcelService],
})
export class ExcelModule {}
