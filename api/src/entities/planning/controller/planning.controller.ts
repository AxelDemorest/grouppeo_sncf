import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { PlanningService } from '../service/planning.service';

@Controller('planning')
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
    );

    if (!generatedPlanning)
      throw new ForbiddenException("Aucun train n'a été trouvé");

    return res.status(HttpStatus.OK).json({
      message: 'PlanningView has been generated successfully!',
      post: generatedPlanning,
    });
  }

  /**
   Retrieves all distinct planning days
   @returns {Promise<Array>} - Array of distinct planning days
   */
  @Get('/')
  async findAllPlanningsDistinctDay() {
    return await this.planningService.findAllPlanningsDistinctDay();
  }

  /**
   Retrieves a specific planning by day and user ID
   @param {string} day - Day of the planning
   @param {number} id - ID of the user
   @returns {Promise<object>} - Found planning matching the specified day and user ID
   */
  @Get('/day/:day/user/:id')
  async findPlanning(@Param('day') day: string, @Param('id') id: number) {
    return await this.planningService.findPlanning(day, id);
  }
}
