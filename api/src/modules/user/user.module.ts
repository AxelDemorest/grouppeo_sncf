import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controller/user.controller';
import { User } from './models/user.entity';
import { UserService } from './service/user.service';
import { MailsModule } from '../mails/mails.module';
import { RadioModule } from '../radio/radio.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RadioModule, MailsModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
