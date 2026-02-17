import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlatDto, UpdatePlatDto } from './dto';

@Injectable()
export class PlatService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.plat.findMany({
      include: {
        allergenes: { include: { allergene: true } },
      },
      orderBy: { titrePlat: 'asc' },
    });
  }

  async findOne(id: number) {
    const plat = await this.prisma.plat.findUnique({
      where: { id },
      include: {
        allergenes: { include: { allergene: true } },
        menus: { include: { menu: true } },
      },
    });

    if (!plat) {
      throw new NotFoundException('Plat introuvable');
    }

    return plat;
  }

  async create(dto: CreatePlatDto) {
    return this.prisma.plat.create({
      data: {
        titrePlat: dto.titrePlat,
        photo: dto.photo,
        type: dto.type,
        allergenes: dto.allergeneIds
          ? { create: dto.allergeneIds.map((allergeneId) => ({ allergeneId })) }
          : undefined,
      },
      include: {
        allergenes: { include: { allergene: true } },
      },
    });
  }

  async update(id: number, dto: UpdatePlatDto) {
    await this.findOne(id);

    const data: any = { ...dto };
    delete data.allergeneIds;

    if (dto.allergeneIds) {
      await this.prisma.platAllergene.deleteMany({ where: { platId: id } });
      data.allergenes = {
        create: dto.allergeneIds.map((allergeneId) => ({ allergeneId })),
      };
    }

    return this.prisma.plat.update({
      where: { id },
      data,
      include: {
        allergenes: { include: { allergene: true } },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.plat.delete({ where: { id } });
  }

  async findAllAllergenes() {
    return this.prisma.allergene.findMany({ orderBy: { libelle: 'asc' } });
  }
}
