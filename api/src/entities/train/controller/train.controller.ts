import { Body, Controller, HttpStatus, Post, Get, Res } from "@nestjs/common";
import { createTrainDTO, TrainDTO } from "../models/train.dto";
import { TrainService } from "../service/train.service";

@Controller('train')
export class TrainController {
    constructor(private readonly trainService: TrainService) {}

    @Post('/train')
    async createTrains(@Res() res, @Body() trains: createTrainDTO[]) {
        const createTrains = await this.trainService.createTrains(trains);
        return res.status(HttpStatus.OK).json({
            message: 'Trains has been submitted successfully!',
            post: createTrains,
        });
    }

    @Get('/train')
    async getTrains() {
        return this.trainService.getAllTrains();
    }
}