import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { PeriodService } from '../service/period.service';
import { periodDTO } from '../models/period.dto';

@Controller('period')
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
}
