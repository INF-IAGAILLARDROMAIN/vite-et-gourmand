import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto, UpdateMenuDto, FilterMenuDto } from './dto';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllThemes() {
    return this.prisma.theme.findMany({ orderBy: { libelle: 'asc' } });
  }

  async findAllRegimes() {
    return this.prisma.regime.findMany({ orderBy: { libelle: 'asc' } });
  }

  async findAll(filters: FilterMenuDto) {
    const where: any = {};

    if (filters.prixMin !== undefined || filters.prixMax !== undefined) {
      where.prixParPersonne = {};
      if (filters.prixMin !== undefined) where.prixParPersonne.gte = filters.prixMin;
      if (filters.prixMax !== undefined) where.prixParPersonne.lte = filters.prixMax;
    }

    if (filters.nbPersonnesMin !== undefined) {
      where.nombrePersonneMinimale = { lte: filters.nbPersonnesMin };
    }

    if (filters.theme) {
      where.themes = {
        some: { theme: { libelle: { equals: filters.theme, mode: 'insensitive' } } },
      };
    }

    if (filters.regime) {
      where.regimes = {
        some: { regime: { libelle: { equals: filters.regime, mode: 'insensitive' } } },
      };
    }

    return this.prisma.menu.findMany({
      where,
      include: {
        themes: { include: { theme: true } },
        regimes: { include: { regime: true } },
        plats: { include: { plat: { include: { allergenes: { include: { allergene: true } } } } } },
        images: true,
      },
      orderBy: { titre: 'asc' },
    });
  }

  async findOne(id: number) {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
      include: {
        themes: { include: { theme: true } },
        regimes: { include: { regime: true } },
        plats: { include: { plat: { include: { allergenes: { include: { allergene: true } } } } } },
        images: true,
      },
    });

    if (!menu) {
      throw new NotFoundException('Menu introuvable');
    }

    return menu;
  }

  async create(dto: CreateMenuDto) {
    return this.prisma.menu.create({
      data: {
        titre: dto.titre,
        nombrePersonneMinimale: dto.nombrePersonneMinimale,
        prixParPersonne: dto.prixParPersonne,
        description: dto.description,
        quantiteRestante: dto.quantiteRestante,
        conditions: dto.conditions,
        themes: dto.themeIds
          ? { create: dto.themeIds.map((themeId) => ({ themeId })) }
          : undefined,
        regimes: dto.regimeIds
          ? { create: dto.regimeIds.map((regimeId) => ({ regimeId })) }
          : undefined,
        plats: dto.platIds
          ? { create: dto.platIds.map((platId) => ({ platId })) }
          : undefined,
      },
      include: {
        themes: { include: { theme: true } },
        regimes: { include: { regime: true } },
        plats: { include: { plat: true } },
        images: true,
      },
    });
  }

  async update(id: number, dto: UpdateMenuDto) {
    await this.findOne(id);

    // If relation arrays are provided, delete existing and recreate
    const data: any = { ...dto };
    delete data.themeIds;
    delete data.regimeIds;
    delete data.platIds;

    if (dto.themeIds) {
      await this.prisma.menuTheme.deleteMany({ where: { menuId: id } });
      data.themes = { create: dto.themeIds.map((themeId) => ({ themeId })) };
    }

    if (dto.regimeIds) {
      await this.prisma.menuRegime.deleteMany({ where: { menuId: id } });
      data.regimes = { create: dto.regimeIds.map((regimeId) => ({ regimeId })) };
    }

    if (dto.platIds) {
      await this.prisma.menuPlat.deleteMany({ where: { menuId: id } });
      data.plats = { create: dto.platIds.map((platId) => ({ platId })) };
    }

    return this.prisma.menu.update({
      where: { id },
      data,
      include: {
        themes: { include: { theme: true } },
        regimes: { include: { regime: true } },
        plats: { include: { plat: true } },
        images: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.menu.delete({ where: { id } });
  }
}
