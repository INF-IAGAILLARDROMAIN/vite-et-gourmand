import { Module } from '@nestjs/common';
import { CommandeController } from './commande.controller';
import { CommandeService } from './commande.service';
import { MailModule } from '../mail/mail.module';
import { MongoModule } from '../mongo/mongo.module';

@Module({
  imports: [MailModule, MongoModule],
  controllers: [CommandeController],
  providers: [CommandeService],
})
export class CommandeModule {}
