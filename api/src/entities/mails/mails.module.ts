import { Module } from '@nestjs/common';
import { MailsService } from './service/mails.service';
import { ConfigService } from '@nestjs/config';
import { SendgridService } from '../../sendgrid.service';

@Module({
  providers: [MailsService, ConfigService, SendgridService],
  exports: [MailsService],
})
export class MailsModule {}
