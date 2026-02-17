import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHoraireDto, UpdateHoraireDto } from './dto';

@Injectable()
export class HoraireService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.horaire.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async create(dto: CreateHoraireDto) {
    return this.prisma.horaire.create({ data: dto });
  }

  async update(id: number, dto: UpdateHoraireDto) {
    const horaire = await this.prisma.horaire.findUnique({ where: { id } });
    if (!horaire) throw new NotFoundException('Horaire introuvable');

    return this.prisma.horaire.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const horaire = await this.prisma.horaire.findUnique({ where: { id } });
    if (!horaire) throw new NotFoundException('Horaire introuvable');

    return this.prisma.horaire.delete({ where: { id } });
  }
}
