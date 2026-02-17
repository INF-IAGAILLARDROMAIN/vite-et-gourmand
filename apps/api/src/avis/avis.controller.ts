import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AvisService } from './avis.service';
import { CreateAvisDto, ValidateAvisDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('avis')
export class AvisController {
  constructor(private readonly avisService: AvisService) {}

  // Public — validated reviews for homepage
  @Get()
  findAllValidated() {
    return this.avisService.findAllValidated();
  }

  // Employee/Admin — pending reviews
  @Get('pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrateur', 'employe')
  findAllPending() {
    return this.avisService.findAllPending();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() dto: CreateAvisDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.avisService.create(dto, userId);
  }

  @Put(':id/validate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrateur', 'employe')
  validate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ValidateAvisDto,
  ) {
    return this.avisService.validate(id, dto);
  }
}
