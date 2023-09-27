import { Injectable } from '@nestjs/common';
import { SendgridService } from '../../../sendgrid.service';
import { MailInput } from '../mail.input';

@Injectable()
export class MailsService {
  constructor(private readonly sendgridService: SendgridService) {}

  async sendEmail(input: MailInput, password: string) {
    const mail = {
      to: 'axel.gil-demorest@sncf.fr',
      subject: input.subject,
      from: 'axel.gil-demorest@sncf.fr',
      templateId: 'Second-f1f71e4ec7d54c3689469a37671c4df9',
      dynamic_template_data: {
        password: password,
      },
    };

    return await this.sendgridService.send(mail);
  }
}
