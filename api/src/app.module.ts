import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SendgridService } from './sendgrid.service';

// Entities

import { Group } from './entities/group/models/group.entity';
import { Train } from './entities/train/models/train.entity';
import { User } from './entities/user/models/user.entity';
import { Radio } from './entities/radio/models/radio.entity';
import { Planning } from './entities/planning/models/planning.entity';
import { MeetingPoint } from './entities/meeting-point/models/meeting-point.entity';
import { Period } from './entities/period/models/period.entity';
import { Status } from './entities/status/models/status.entity';
import { GroupStatus } from './entities/group-status/models/group-status.entity';

// Modules

import { AuthModule } from './auth/auth.module';
import { GroupModule } from './entities/group/group.module';
import { MailsModule } from './entities/mails/mails.module';
import { UserModule } from './entities/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PlanningModule } from './entities/planning/planning.module';
import { TrainModule } from './entities/train/train.module';
import { RadioModule } from './entities/radio/radio.module';
import { MeetingPointModule } from './entities/meeting-point/meeting-point.module';
import { PeriodModule } from './entities/period/period.module';
import { StatusModule } from './entities/status/status.module';
import { GroupStatusModule } from './entities/group-status/group-status.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        Group,
        Train,
        User,
        Planning,
        Radio,
        MeetingPoint,
        Period,
        Status,
        GroupStatus,
      ],
      synchronize: true,
    }),
    GroupModule,
    TrainModule,
    UserModule,
    PlanningModule,
    RadioModule,
    MeetingPointModule,
    PeriodModule,
    AuthModule,
    MailsModule,
    StatusModule,
    GroupStatusModule,
  ],
  controllers: [AppController],
  providers: [AppService, SendgridService],
})
export class AppModule {}
