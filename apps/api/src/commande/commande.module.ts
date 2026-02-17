import { Module } from '@nestjs/common';
import { CommandeController } from './commande.controller';
import { CommandeService } from './commande.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [CommandeController],
  providers: [CommandeService],
})
export class CommandeModule {}
