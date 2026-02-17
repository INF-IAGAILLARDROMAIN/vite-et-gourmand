import { Module } from '@nestjs/common';
import { HoraireController } from './horaire.controller';
import { HoraireService } from './horaire.service';

@Module({
  controllers: [HoraireController],
  providers: [HoraireService],
})
export class HoraireModule {}
