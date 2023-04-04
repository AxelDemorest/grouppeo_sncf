import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Radio } from './models/radio.entity';
import { RadioService } from './service/radio.service';
import { RadioController } from './controller/radio.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Radio])],
  providers: [RadioService],
  controllers: [RadioController],
  exports: [RadioService],
})
export class RadioModule {}
