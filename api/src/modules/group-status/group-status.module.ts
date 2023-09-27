import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupStatus } from './models/group-status.entity';
import { GroupStatusController } from './controller/group-status.controller';
import { GroupStatusService } from './service/group-status.service';
import { Group } from '../group/models/group.entity';
import { Status } from '../status/models/status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupStatus, Group, Status])],
  providers: [GroupStatusService],
  controllers: [GroupStatusController],
})
export class GroupStatusModule {}
