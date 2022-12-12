import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainController } from './controller/train.controller';
import { Train } from './models/train.entity';
import { TrainService } from './service/train.service';

@Module({
  imports: [TypeOrmModule.forFeature([Train])],
  providers: [TrainService],
  controllers: [TrainController],
})
export class TrainModule {}
