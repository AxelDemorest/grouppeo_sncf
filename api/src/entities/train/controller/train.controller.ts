import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Get,
  Res,
  Patch,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { GroupService } from 'src/entities/group/service/group.service';
import { createTrainDTO, formTrainDTO } from '../models/train.dto';
import { TrainService } from '../service/train.service';

@Controller('train')
export class TrainController {
  constructor(
    private readonly trainService: TrainService,
    private readonly groupService: GroupService,
  ) {}

  @Post('/')
  async createTrains(@Res() res, @Body() data: formTrainDTO) {
    const createTrains = await this.trainService.createTrains(data);

    return res.status(HttpStatus.OK).json({
      message: 'Trains has been submitted successfully!',
      post: createTrains,
    });
  }

  @Patch('/train')
  async updateTrains(@Res() res, @Body() updates: formTrainDTO) {
    await this.trainService.updateTrainsAndGroups(updates);
    await this.trainService.createTrains(updates);
    console.log("c'est update");
    return res.status(HttpStatus.OK).json({
      message: 'Trains has been submitted successfully!',
    });
  }

  @Get('/train')
  async getAllTrainsWithoutSupportedGroups() {
    return this.trainService.getAllTrainsWithoutSupportedGroups();
  }

  @Get('/train_groups_supported')
  async getAllTrainsWithSupportedGroups() {
    return this.trainService.getAllTrainsWithSupportedGroups();
  }

  @Get('/:date')
  async findTrainsOfOneDay(@Param('date') date: string) {
    const trains =
      await this.trainService.findTrainsOfOneDayWithSupportedGroups(date);
    if (!trains) throw new NotFoundException('No train matches with this day');
    return trains;
  }
}
