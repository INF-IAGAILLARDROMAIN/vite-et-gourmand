import { Module } from '@nestjs/common';
import { CommandeController } from './commande.controller.js';
import { CommandeService } from './commande.service.js';
import { MailModule } from '../mail/mail.module.js';

@Module({
  imports: [MailModule],
  controllers: [CommandeController],
  providers: [CommandeService],
})
export class CommandeModule {}
