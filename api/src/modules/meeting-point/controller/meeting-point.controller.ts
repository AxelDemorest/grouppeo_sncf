import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { MeetingPointService } from '../service/meeting-point.service';
import {
  createMeetingPointDTO,
  UpdateMeetingPointDto,
} from '../models/meeting-point.dto';

@Controller('api/meeting-point')
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

  @Get(':name')
  async getMeetingPoint(@Res() res, @Param('name') name: string) {
    const meetingPoint = await this.meetingPointService.getMeetingPoint(name);
    if (!meetingPoint)
      throw new NotFoundException('Meeting point does not exist!');
    return res.status(HttpStatus.OK).json(meetingPoint);
  }

  @Get('/')
  async getMeetingPoints(@Res() res) {
    const meetingPoints = await this.meetingPointService.getMeetingPoints();
    return res.status(HttpStatus.OK).json(meetingPoints);
  }

  @Patch('/:id')
  async updateMeetingPoint(
    @Res() res,
    @Param('id') id: string,
    @Body() meetingPoint: UpdateMeetingPointDto,
  ) {
    const updatedMeetingPoint =
      await this.meetingPointService.updateMeetingPoint(
        Number(id),
        meetingPoint,
      );
    if (!updatedMeetingPoint)
      throw new NotFoundException('Meeting point does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'Meeting point has been successfully updated',
      post: updatedMeetingPoint,
    });
  }

  @Delete('/:id')
  async deleteMeetingPoint(@Res() res, @Param('id') id: string) {
    const meetingPoint = await this.meetingPointService.deleteMeetingPoint(
      Number(id),
    );
    if (!meetingPoint)
      throw new NotFoundException('Meeting point does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'Meeting point has been deleted',
      post: meetingPoint,
    });
  }
}
