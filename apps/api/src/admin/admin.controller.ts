import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateEmployeeDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('administrateur')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('employees')
  getEmployees() {
    return this.adminService.getEmployees();
  }

  @Post('employees')
  createEmployee(@Body() dto: CreateEmployeeDto) {
    return this.adminService.createEmployee(dto);
  }

  @Put('employees/:id/disable')
  disableEmployee(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.disableEmployee(id);
  }

  @Get('stats/orders')
  getOrderStats() {
    return this.adminService.getOrderStats();
  }

  @Get('stats/revenue')
  getRevenueStats(
    @Query('menuId') menuId?: string,
    @Query('dateDebut') dateDebut?: string,
    @Query('dateFin') dateFin?: string,
  ) {
    return this.adminService.getRevenueStats({
      menuId: menuId ? parseInt(menuId) : undefined,
      dateDebut,
      dateFin,
    });
  }

  @Post('stats/sync')
  syncOrderStats() {
    return this.adminService.syncOrderStats();
  }
}
