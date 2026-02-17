import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandeService } from './commande.service';
import { CreateCommandeDto, UpdateCommandeDto, UpdateStatutDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('commandes')
@UseGuards(JwtAuthGuard)
export class CommandeController {
  constructor(private readonly commandeService: CommandeService) {}

  @Post()
  create(
    @Body() dto: CreateCommandeDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.commandeService.create(dto, userId);
  }

  @Get()
  findAll(
    @CurrentUser('id') userId: number,
    @CurrentUser('role') role: string,
    @Query('statut') statut?: string,
  ) {
    return this.commandeService.findAll(userId, role, statut);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @CurrentUser('role') role: string,
  ) {
    return this.commandeService.findOne(id, userId, role);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCommandeDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.commandeService.update(id, dto, userId);
  }

  @Delete(':id')
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.commandeService.cancel(id, userId);
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles('administrateur', 'employe')
  updateStatut(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatutDto,
  ) {
    return this.commandeService.updateStatut(id, dto);
  }
}
