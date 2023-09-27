import { Controller, Get, Param, Post } from '@nestjs/common';
import { GroupStatusService } from '../service/group-status.service';
import { GroupStatus } from '../models/group-status.entity';

@Controller('api/group-status')
export class GroupStatusController {
  constructor(private groupStatusService: GroupStatusService) {}

  @Get('/:groupId/status')
  async findStatusByGroupId(
    @Param('groupId') groupId: number,
  ): Promise<GroupStatus[]> {
    return this.groupStatusService.findStatusByGroupId(groupId);
  }

  @Post('/:groupId/statuses/:statusId')
  async createGroupStatus(
    @Param('groupId') groupId: number,
    @Param('statusId') statusId: number,
  ): Promise<GroupStatus> {
    return this.groupStatusService.createGroupStatus(groupId, statusId);
  }
}
