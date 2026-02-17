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
import { PlatService } from './plat.service';
import { CreatePlatDto, UpdatePlatDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('plats')
export class PlatController {
  constructor(private readonly platService: PlatService) {}

  @Get()
  findAll() {
    return this.platService.findAll();
  }

  @Get('allergenes')
  findAllAllergenes() {
    return this.platService.findAllAllergenes();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.platService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrateur', 'employe')
  create(@Body() dto: CreatePlatDto) {
    return this.platService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrateur', 'employe')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePlatDto) {
    return this.platService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrateur', 'employe')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.platService.remove(id);
  }
}
