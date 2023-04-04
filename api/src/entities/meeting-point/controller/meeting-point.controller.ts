import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { MeetingPointService } from '../service/meeting-point.service';
import { createMeetingPointDTO } from '../models/meeting-point.dto';

@Controller('meeting-point')
export class MeetingPointController {
  constructor(private readonly meetingPointService: MeetingPointService) {}

  @Post('/')
  async createMeetingPoint(
    @Res() res,
    @Body() meetingPoint: createMeetingPointDTO,
  ) {
    const createMeetingPoint =
      await this.meetingPointService.createMeetingPoint(meetingPoint);
    return res.status(HttpStatus.OK).json({
      message: 'meeting point has been submitted successfully!',
      post: createMeetingPoint,
    });
  }

  @Get('/')
  async getMeetingPoints(@Res() res) {
    const meetingPoints = await this.meetingPointService.getMeetingPoints();
    return res.status(HttpStatus.OK).json(meetingPoints);
  }

  @Delete('/:id')
  async deleteMeetingPoint(@Res() res, @Param('id') id: number) {
    const meetingPoint = await this.meetingPointService.deleteMeetingPoint(id);
    if (!meetingPoint)
      throw new NotFoundException('Meeting point does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'Meeting point has been deleted',
      post: meetingPoint,
    });
  }
}
