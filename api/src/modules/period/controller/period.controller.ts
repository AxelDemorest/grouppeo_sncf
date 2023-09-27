import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { PeriodService } from '../service/period.service';
import { periodDTO } from '../models/period.dto';

@Controller('api/period')
export class PeriodController {
  constructor(private readonly periodService: PeriodService) {}

  @Post('/')
  async createPeriod(@Res() res, @Body() period: periodDTO) {
    const createPeriod = await this.periodService.createPeriod(period);
    return res.status(HttpStatus.OK).json({
      message: 'period has been submitted successfully!',
      post: createPeriod,
    });
  }

  @Get('/')
  async getPeriods(@Res() res) {
    const periods = await this.periodService.getPeriods();
    return res.status(HttpStatus.OK).json(periods);
  }

  @Get('/:id')
  async findPeriodById(@Res() res, @Param('id') id: number) {
    const period = await this.periodService.findPeriodById(id);
    return res.status(HttpStatus.OK).json(period);
  }

  @Get('/:name')
  async findPeriodByName(@Res() res, @Param('name') name: string) {
    const period = await this.periodService.findPeriodByName(name);
    return res.status(HttpStatus.OK).json(period);
  }
}
