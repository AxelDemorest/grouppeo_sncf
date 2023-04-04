import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupModule } from '../group/group.module';
import { TrainController } from './controller/train.controller';
import { Train } from './models/train.entity';
import { TrainService } from './service/train.service';

@Module({
  imports: [TypeOrmModule.forFeature([Train]), GroupModule],
  providers: [TrainService],
  controllers: [TrainController],
  exports: [TrainService],
})
export class TrainModule {}
