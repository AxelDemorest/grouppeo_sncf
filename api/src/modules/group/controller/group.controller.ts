import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { GroupDTO } from '../models/group.dto';
import { Group } from '../models/group.entity';
import { GroupService } from '../service/group.service';

@Controller('api/group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  // --- GET methods ---

  /**
   * Fetches a group by its ID.
   * @param {number} group_id - ID of the group.
   * @returns {Promise<Group>} - A single group entity.
   */
  @Get('/:group_id')
  fetchGroupById(@Param('group_id') group_id: number) {
    return this.groupService.getGroupById(group_id);
  }

  /**
   * Retrieves supported groups by a given date.
   * @param {string} date - The date to fetch supported groups for.
   */
  @Get('/supported-groups/:date')
  fetchSupportedGroupsByDate(@Param('date') date: string) {
    return this.groupService.findSupportedGroups(date);
  }

  /**
   * Fetches groups for a given date.
   * @param {string} date - The specific date.
   * @returns {Promise<Group[]>} - An array of groups.
   */
  @Get('day/:date')
  fetchGroupsForGivenDay(@Param('date') date: string): Promise<Group[]> {
    return this.groupService.getGroupsOfOnePlanningDay(date);
  }

  /**
   * Retrieves isolated groups for a particular day.
   * @param {string} date - The specific date.
   * @returns {Promise<Group[]>} - An array of isolated groups.
   */
  @Get('day/:date/isolated-groups')
  fetchIsolatedGroupsForGivenDay(
    @Param('date') date: string,
  ): Promise<Group[]> {
    return this.groupService.getIsolatedGroupsOfPlanning(date);
  }

  /**
   * Gets the count of groups for a specific date.
   * @param {string} date - The date.
   * @param {string} supported - Flag to check if supported or not.
   */
  @Get('date/:date')
  fetchGroupCountForGivenDay(
    @Param('date') date: string,
    @Query('supported') supported: string,
  ) {
    const isSupported = supported === 'true';
    return this.groupService.getCountOfGroupsOfOneDay(date, isSupported);
  }

  /**
   * Retrieves groups list for a particular date.
   * @param {string} date - The date.
   */
  @Get('list/date')
  fetchGroupsListForDate(@Query('date') date: string) {
    return this.groupService.getGroupsOfOneDay(date);
  }

  /**
   * Finds groups for a specific meeting point on a given day.
   * @param {string} day - The day.
   * @param {string} group_meeting_point - The meeting point of the group.
   */
  @Get('/day/:day/group-meeting-point/:group')
  fetchGroupsForMeetingPointOnGivenDay(
    @Param('day') day: string,
    @Param('group') group_meeting_point: string,
  ) {
    return this.groupService.findGroupsForMeetingPoint(
      day,
      group_meeting_point,
    );
  }

  /**
   * Gets group counts for the next 5 days.
   */
  @Get('/list/counts')
  fetchGroupCountsForUpcomingDays() {
    return this.groupService.getGroupCountsForNext5Days();
  }

  /**
   * Finds groups without a meeting point for a specific day.
   * @param {string} day - The day.
   */
  @Get('/without-meeting-point/:day')
  fetchGroupsWithoutMeetingPoint(@Param('day') day: string) {
    return this.groupService.findAllGroupsWithoutMeetingPoint(day);
  }

  /**
   * Retrieves groups for a specific planning ID.
   * @param {string} id - The planning ID.
   */
  @Get('planning/:id')
  fetchGroupsForSpecificPlanning(@Param('id') id: string) {
    return this.groupService.findGroupsForPlanning(Number(id));
  }

  /**
   * Fetches groups for an agent on a given day.
   * @param {string} day - The day.
   * @param {string} number - The agent number.
   */
  @Get('planning/day/:day/agent/:number')
  fetchGroupsForAgentOnGivenDay(
    @Param('day') day: string,
    @Param('number') number: string,
  ) {
    return this.groupService.findGroupsForPlanningAndAgent(day, number);
  }

  /**
   * Gets all groups associated with an agent.
   */
  @Get('agent')
  fetchAllGroupsForAgent() {
    return this.groupService.findGroupsForAgent();
  }

  // --- POST methods ---

  /**
   * Creates a new group.
   * @param {GroupDTO} group - The group details.
   * @returns {Promise<Group>} - The newly created group.
   */
  @Post('/')
  createNewGroup(@Body() group: GroupDTO): Promise<Group> {
    return this.groupService.createGroup(group);
  }

  /**
   * Assigns a train track to a specific group.
   * @param {number} id - The group ID.
   * @param {string} trainTrack - The train track to be assigned.
   */
  @Post(':id/train-track')
  assignTrainTrackToGroup(
    @Param('id') id: number,
    @Body('trainTrack') trainTrack: string,
  ) {
    return this.groupService.updateTrainTrack(id, trainTrack);
  }

  /**
   * Assigns a specific planning to a group.
   * @param {number} groupId - The group ID.
   * @param {number} planningId - The planning ID.
   * @returns {Promise<void>}
   */
  @Post(':groupId/assign-planning/:planningId')
  assignSpecificPlanningToGroup(
    @Param('groupId') groupId: number,
    @Param('planningId') planningId: number,
  ): Promise<void> {
    return this.groupService.assignPlanningToGroup(groupId, planningId);
  }

  // --- PATCH methods ---

  /**
   * Modifies group details.
   * @param {number} group_id - The group ID.
   * @param {GroupDTO} group - The new group details.
   * @returns {Promise<GroupDTO>} - The updated group details.
   */
  @Patch('/:group_id')
  modifyGroupDetails(
    @Param('group_id') group_id: number,
    @Body() group: GroupDTO,
  ): Promise<GroupDTO> {
    return this.groupService.updateGroup(group_id, group);
  }

  /**
   * Toggles the type of group.
   * @param {number} group_id - The group ID.
   * @param {GroupDTO} data - The data containing the new type.
   */
  @Patch(':group_id/type/switch')
  toggleGroupType(@Param('group_id') group_id: number, @Body() data: GroupDTO) {
    return this.groupService.updateType(group_id, data);
  }

  // --- DELETE methods ---

  /**
   * Removes a planning from a group.
   * @param {number} groupId - The group ID.
   * @returns {Promise<void>}
   */
  @Delete(':groupId/planning')
  detachPlanningFromGroup(@Param('groupId') groupId: number): Promise<void> {
    return this.groupService.removePlanningFromGroup(groupId);
  }
}
