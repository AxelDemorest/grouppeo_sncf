import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
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

  @Patch('/:group_id')
  update(
    @Param('group_id') group_id: number,
    @Body() group: GroupDTO,
  ): Promise<Group> {
    return this.groupService.updateGroup(group_id, group);
  }
}
