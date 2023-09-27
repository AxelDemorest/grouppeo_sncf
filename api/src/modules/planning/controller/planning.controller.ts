import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { PlanningService } from '../service/planning.service';
import { AssignAgentDto } from '../models/dto/assign-agent.dto';

@Controller('api/planning')
export class PlanningController {
  constructor(private readonly planningService: PlanningService) {}

  /**
   Creates a new planning
   @param {Res} res - Express response object
   @param {Body} data - Request body data
   @returns {Promise<object>} - JSON object with success message and generated planning
   @throws {ForbiddenException} - If no trains are found
   */
  @Post('/')
  async createPlanning(@Res() res, @Body() data) {
    const generatedPlanning = await this.planningService.createPlanning(
      data.day,
      data.numAgents,
    );

    if (!generatedPlanning)
      throw new ForbiddenException("Aucun train n'a été trouvé");

    return res.status(HttpStatus.OK).json({
      message: 'planningView has been generated successfully!',
      post: generatedPlanning,
    });
  }

  @Get(':id')
  async findPlanningById(@Param('id') id: string) {
    return await this.planningService.findPlanningById(Number(id));
  }

  @Post('assign-agents')
  async assignAgentToUser(
    @Body() assignAgentDto: AssignAgentDto,
  ): Promise<any> {
    const response = this.planningService.assignAgentToUser(assignAgentDto);
    if (!response)
      throw new NotFoundException(
        `No planning found for agent number ${assignAgentDto.agentNumber} on day ${assignAgentDto.day}`,
      );
    return response;
  }

  /**
   Retrieves all distinct planning days
   @returns {Promise<Array>} - Array of distinct planning days
   */
  @Get('/')
  async findAllPlanningsDistinctDay() {
    return await this.planningService.findAllPlanningsDistinctDay();
  }

  @Get('/day/:day/all')
  async findAllPlanningsByDayDistinctDay(@Param('day') day: string) {
    return await this.planningService.findAllPlanningsByDayDistinctDay(day);
  }

  @Get('/day/:day/agents/count')
  async getCountAgentsForPlanning(@Param('day') day: string) {
    return await this.planningService.getCountAgentsForPlanning(day);
  }

  @Get('day/:day')
  async findPlanningByDay(@Param('day') day: string) {
    return await this.planningService.findPlanningByDay(day);
  }

  /**
   Retrieves a specific planning by day and user ID
   @param {string} day - Day of the planning
   @param {number} id - ID of the user
   @returns {Promise<object>} - Found planning matching the specified day and user ID
   */
  @Get('/day/:day/user/:id')
  async findPlanning(@Param('day') day: string, @Param('id') id: string) {
    return await this.planningService.findPlanning(day, Number(id));
  }

  @Get('/day/:day/agent-number/:id')
  async findPlanningByAgentNumber(
    @Param('day') day: string,
    @Param('id') id: string,
  ) {
    return await this.planningService.findPlanningByAgentNumber(
      day,
      Number(id),
    );
  }

  @Delete('day/:date')
  async deletePlanningByDate(@Param('date') date: string): Promise<void> {
    await this.planningService.deletePlanningByDate(date);
  }

  @Delete(':id')
  async deletePlanning(@Param('id') id: string) {
    return await this.planningService.deletePlanning(Number(id));
  }
}
