import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planning } from './models/planning.entity';
import { PlanningService } from './service/planning.service';
import { PlanningController } from './controller/planning.controller';
import { TrainModule } from '../train/train.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Planning]),
    forwardRef(() => TrainModule),
    UserModule,
  ],
  providers: [PlanningService],
  controllers: [PlanningController],
  exports: [PlanningService],
})
export class PlanningModule {}
