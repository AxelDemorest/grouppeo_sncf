import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Period } from './models/period.entity';
import { PeriodController } from './controller/period.controller';
import { PeriodService } from './service/period.service';

@Module({
  imports: [TypeOrmModule.forFeature([Period])],
  controllers: [PeriodController],
  providers: [PeriodService],
  exports: [PeriodService],
})
export class PeriodModule {}
