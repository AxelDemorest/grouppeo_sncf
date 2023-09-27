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
  Query,
} from '@nestjs/common';
import { GroupService } from 'src/modules/group/service/group.service';
import {
  createTrainDTO,
  formTrainDTO,
  TrainDTO,
  UpdateTrainDTO,
} from '../models/train.dto';
import { TrainService } from '../service/train.service';

@Controller('api/train')
export class TrainController {
  constructor(private readonly trainService: TrainService) {}

  @Post('/create')
  async createTrain(@Res() res, @Body() data: TrainDTO) {
    const train = await this.trainService.createOneTrain(data);

    return res.status(HttpStatus.OK).json({
      message: 'Train has been submitted successfully!',
      post: train,
    });
  }

  @Post('/')
  async createTrains(@Res() res, @Body() data: formTrainDTO) {
    const createTrains = await this.trainService.createTrains(data);

    return res.status(HttpStatus.OK).json({
      message: 'Trains has been submitted successfully!',
      post: createTrains,
    });
  }

  @Get('/')
  async getAllTrains() {
    return this.trainService.findTrains();
  }

  @Get('/day')
  async getTrainOfOneDay(@Query('day') day: string) {
    return this.trainService.getTrainOfOneDay(day);
  }

  @Get('/:date')
  async findTrainsOfOneDay(@Param('date') date: string) {
    const trains =
      await this.trainService.findTrainsOfOneDayWithSupportedGroups(date);
    if (!trains) throw new NotFoundException('No train matches with this day');
    return trains;
  }

  @Patch('/:id')
  async updateTrainById(
    @Res() res,
    @Param('id') id: string,
    @Body() updates: UpdateTrainDTO,
  ) {
    await this.trainService.updateTrainById(Number(id), updates);
    return res.status(HttpStatus.OK).json({
      message: 'Trains has been submitted successfully!',
    });
  }

  @Patch('/')
  async updateTrains(@Res() res, @Body() updates: formTrainDTO) {
    await this.trainService.updateTrainsAndGroups(updates);
    await this.trainService.createTrains(updates);
    return res.status(HttpStatus.OK).json({
      message: 'Trains has been submitted successfully!',
    });
  }

  @Get('/train')
  async getAllTrainsWithoutSupportedGroups(@Query('period') period?: string) {
    return this.trainService.getAllTrainsWithoutSupportedGroups(period);
  }

  @Get('/train_groups_supported')
  async getAllTrainsWithSupportedGroups() {
    return this.trainService.getAllTrainsWithSupportedGroups();
  }

  @Get('/:number/day/:date')
  async findTrainByNumber(
    @Param('number') number: string,
    @Param('date') date: string,
  ) {
    const train = await this.trainService.findTrainByNumber(number, date);
    if (!train)
      throw new NotFoundException('No train matches with this number');
    return train;
  }
}
