import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MailModule } from '../mail/mail.module';
import { MongoModule } from '../mongo/mongo.module';

@Module({
  imports: [MailModule, MongoModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
