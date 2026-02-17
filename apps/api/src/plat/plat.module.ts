import { Module } from '@nestjs/common';
import { PlatController } from './plat.controller';
import { PlatService } from './plat.service';

@Module({
  controllers: [PlatController],
  providers: [PlatService],
  exports: [PlatService],
})
export class PlatModule {}
