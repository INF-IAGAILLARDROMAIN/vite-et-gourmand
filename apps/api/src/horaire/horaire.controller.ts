import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { HoraireService } from './horaire.service';
import { CreateHoraireDto, UpdateHoraireDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('horaires')
export class HoraireController {
  constructor(private readonly horaireService: HoraireService) {}

  @Get()
  findAll() {
    return this.horaireService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrateur', 'employe')
  create(@Body() dto: CreateHoraireDto) {
    return this.horaireService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrateur', 'employe')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHoraireDto) {
    return this.horaireService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrateur', 'employe')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.horaireService.remove(id);
  }
}
