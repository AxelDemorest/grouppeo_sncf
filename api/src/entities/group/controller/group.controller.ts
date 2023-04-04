import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { GroupDTO } from '../models/group.dto';
import { Group } from '../models/group.entity';
import { GroupService } from '../service/group.service';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get('/:group_id')
  getGroupById(@Param('group_id') group_id: number) {
    return this.groupService.getGroupById(group_id);
  }

  @Get('day/:date')
  async getGroupsOfOnePlanningDay(
    @Param('date') date: string,
  ): Promise<Group[]> {
    return await this.groupService.getGroupsOfOnePlanningDay(date);
  }

  @Get('date/:date')
  async getCountOfGroupsOfOneDay(@Param('date') date: string) {
    return await this.groupService.getCountOfGroupsOfOneDay(date);
  }

  @Get('list/date')
  async getGroupsOfOneDay(@Query('date') date: string) {
    return await this.groupService.getGroupsOfOneDay(date);
  }

  @Get('/day/:day/group-meeting-point/:group')
  async findGroupsForMeetingPoint(
    @Param('day') day: string,
    @Param('group') group_meeting_point: string,
  ) {
    return await this.groupService.findGroupsForMeetingPoint(
      day,
      group_meeting_point,
    );
  }

  @Get('/list/counts')
  async getGroupCountsForNext5Days() {
    return await this.groupService.getGroupCountsForNext5Days();
  }

  @Patch('/:group_id')
  update(
    @Param('group_id') group_id: number,
    @Body() group: GroupDTO,
  ): Promise<GroupDTO> {
    return this.groupService.updateGroup(group_id, group);
  }

  @Patch(':group_id/type/switch')
  updateType(@Param('group_id') group_id: number, @Body() data: GroupDTO) {
    return this.groupService.updateType(group_id, data);
  }
}
