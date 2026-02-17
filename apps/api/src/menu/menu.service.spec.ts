import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MenuService } from './menu.service';
import { PrismaService } from '../prisma/prisma.service';

describe('MenuService', () => {
  let menuService: MenuService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    menu: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    menuService = module.get<MenuService>(MenuService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(menuService).toBeDefined();
  });

  // ─── findAll ─────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('should return an array of menus', async () => {
      const mockMenus = [
        {
          id: 1,
          titre: 'Menu Classique',
          nombrePersonneMinimale: 10,
          prixParPersonne: 25.0,
          description: 'Un menu classique pour toutes les occasions',
          quantiteRestante: 5,
          conditions: null,
          themes: [{ theme: { id: 1, libelle: 'Mariage' } }],
          regimes: [{ regime: { id: 1, libelle: 'Standard' } }],
          plats: [],
          images: [],
        },
        {
          id: 2,
          titre: 'Menu Végétarien',
          nombrePersonneMinimale: 8,
          prixParPersonne: 22.0,
          description: 'Un menu entièrement végétarien',
          quantiteRestante: 3,
          conditions: null,
          themes: [],
          regimes: [{ regime: { id: 2, libelle: 'Végétarien' } }],
          plats: [],
          images: [],
        },
      ];

      mockPrismaService.menu.findMany.mockResolvedValue(mockMenus);

      const result = await menuService.findAll({});

      expect(result).toEqual(mockMenus);
      expect(result).toHaveLength(2);
      expect(mockPrismaService.menu.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          themes: { include: { theme: true } },
          regimes: { include: { regime: true } },
          plats: {
            include: {
              plat: {
                include: { allergenes: { include: { allergene: true } } },
              },
            },
          },
          images: true,
        },
        orderBy: { titre: 'asc' },
      });
    });
  });

  // ─── findOne ─────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('should return a menu by id', async () => {
      const mockMenu = {
        id: 1,
        titre: 'Menu Classique',
        nombrePersonneMinimale: 10,
        prixParPersonne: 25.0,
        description: 'Un menu classique pour toutes les occasions',
        quantiteRestante: 5,
        conditions: null,
        themes: [{ theme: { id: 1, libelle: 'Mariage' } }],
        regimes: [{ regime: { id: 1, libelle: 'Standard' } }],
        plats: [],
        images: [],
      };

      mockPrismaService.menu.findUnique.mockResolvedValue(mockMenu);

      const result = await menuService.findOne(1);

      expect(result).toEqual(mockMenu);
      expect(mockPrismaService.menu.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          themes: { include: { theme: true } },
          regimes: { include: { regime: true } },
          plats: {
            include: {
              plat: {
                include: { allergenes: { include: { allergene: true } } },
              },
            },
          },
          images: true,
        },
      });
    });

    it('should throw NotFoundException when menu does not exist', async () => {
      mockPrismaService.menu.findUnique.mockResolvedValue(null);

      await expect(menuService.findOne(999)).rejects.toThrow(
        NotFoundException,
      );
      await expect(menuService.findOne(999)).rejects.toThrow(
        'Menu introuvable',
      );

      expect(mockPrismaService.menu.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
        include: {
          themes: { include: { theme: true } },
          regimes: { include: { regime: true } },
          plats: {
            include: {
              plat: {
                include: { allergenes: { include: { allergene: true } } },
              },
            },
          },
          images: true,
        },
      });
    });
  });
});
