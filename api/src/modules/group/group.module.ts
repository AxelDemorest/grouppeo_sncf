import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupController } from './controller/group.controller';
import { Group } from './models/group.entity';
import { GroupService } from './service/group.service';
import { PlanningModule } from '../planning/planning.module';
import { TrainModule } from '../train/train.module';

@Module({
  imports: [TypeOrmModule.forFeature([Group]), PlanningModule, TrainModule],
  providers: [GroupService],
  controllers: [GroupController],
  exports: [GroupService],
})
export class GroupModule {}
