import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly mailService: MailService) {}

  async send(dto: CreateContactDto) {
    await this.mailService.sendContactEmail(dto.sujet, dto.message, dto.email, dto.nom);

    return { message: 'Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.' };
  }
}
