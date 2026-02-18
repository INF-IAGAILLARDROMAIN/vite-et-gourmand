import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MenuModule } from './menu/menu.module';
import { PlatModule } from './plat/plat.module';
import { CommandeModule } from './commande/commande.module';
import { AvisModule } from './avis/avis.module';
import { HoraireModule } from './horaire/horaire.module';
import { ContactModule } from './contact/contact.module';
import { AdminModule } from './admin/admin.module';
import { MongoModule } from './mongo/mongo.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    MongoModule.forRoot(),
    AuthModule,
    MenuModule,
    PlatModule,
    CommandeModule,
    AvisModule,
    HoraireModule,
    ContactModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
