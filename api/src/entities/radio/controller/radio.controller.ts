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
import { RadioService } from '../service/radio.service';
import { createRadioDTO } from '../models/radio.dto';

@Controller('radio')
export class RadioController {
  constructor(private readonly radioService: RadioService) {}

  @Post('/')
  async createRadio(@Res() res, @Body() radio: createRadioDTO) {
    const createRadio = await this.radioService.createRadio(radio);
    return res.status(HttpStatus.OK).json({
      message: 'Radio has been submitted successfully!',
      post: createRadio,
    });
  }

  @Get('/')
  async getRadios(@Res() res) {
    const radios = await this.radioService.getRadios();
    return res.status(HttpStatus.OK).json(radios);
  }

  @Delete('/:id')
  async deleteRadio(@Res() res, @Param('id') id: number) {
    const radio = await this.radioService.deleteRadio(id);
    if (!radio) throw new NotFoundException('Radio does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'Radio has been deleted',
      post: radio,
    });
  }

  @Get('/:number')
  async getRadio(@Res() res, @Param('number') number: string) {
    const radio = await this.radioService.getRadioByNumber(number);
    if (!radio) throw new NotFoundException('Radio does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'Radio has been found',
      post: radio,
    });
  }
}
