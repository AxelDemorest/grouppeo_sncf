import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GroupModule } from './entities/group/group.module';
import { Group } from './entities/group/models/group.entity';
import { Train } from './entities/train/models/train.entity';
import { TrainModule } from './entities/train/train.module';
import { User } from './entities/user/models/user.entity';
import { UserModule } from './entities/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 8889,
      username: 'root',
      password: 'root',
      database: 'grouppeo_sncf',
      entities: [Group, Train, User],
      synchronize: true,
    }),
    GroupModule,
    TrainModule,
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
