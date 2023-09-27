import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SendgridService } from './sendgrid.service';

// Entities

import { Group } from './modules/group/models/group.entity';
import { Train } from './modules/train/models/train.entity';
import { User } from './modules/user/models/user.entity';
import { Radio } from './modules/radio/models/radio.entity';
import { Planning } from './modules/planning/models/planning.entity';
import { MeetingPoint } from './modules/meeting-point/models/meeting-point.entity';
import { Period } from './modules/period/models/period.entity';
import { Status } from './modules/status/models/status.entity';
import { GroupStatus } from './modules/group-status/models/group-status.entity';

// Modules

import { AuthModule } from './auth/auth.module';
import { GroupModule } from './modules/group/group.module';
import { MailsModule } from './modules/mails/mails.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PlanningModule } from './modules/planning/planning.module';
import { TrainModule } from './modules/train/train.module';
import { RadioModule } from './modules/radio/radio.module';
import { MeetingPointModule } from './modules/meeting-point/meeting-point.module';
import { PeriodModule } from './modules/period/period.module';
import { StatusModule } from './modules/status/status.module';
import { GroupStatusModule } from './modules/group-status/group-status.module';
import { ExcelModule } from './modules/excel/excel.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<number>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
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
    ExcelModule,
  ],
  controllers: [AppController],
  providers: [AppService, SendgridService],
})
export class AppModule {}
