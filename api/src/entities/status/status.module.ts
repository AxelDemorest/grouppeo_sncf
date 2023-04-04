import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Status } from './models/status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Status])],
  providers: [],
  controllers: [],
})
export class StatusModule {}
