import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateEmployeeDto } from './dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async createEmployee(dto: CreateEmployeeDto) {
    const existing = await this.prisma.utilisateur.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Un compte avec cet email existe déjà');
    }

    let role = await this.prisma.role.findUnique({
      where: { libelle: 'employe' },
    });

    if (!role) {
      role = await this.prisma.role.create({ data: { libelle: 'employe' } });
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const employee = await this.prisma.utilisateur.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        nom: dto.nom,
        prenom: dto.prenom,
        telephone: dto.telephone,
        adressePostale: dto.adressePostale,
        roleId: role.id,
      },
      include: { role: true },
    });

    // Send notification email (without password)
    this.mailService.sendEmployeeCreatedEmail(employee.email, employee.prenom);

    return {
      message: 'Compte employé créé avec succès',
      employee: {
        id: employee.id,
        email: employee.email,
        nom: employee.nom,
        prenom: employee.prenom,
        role: employee.role.libelle,
      },
    };
  }

  async disableEmployee(id: number) {
    const employee = await this.prisma.utilisateur.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!employee) throw new NotFoundException('Employé introuvable');
    if (employee.role.libelle === 'administrateur') {
      throw new ConflictException('Impossible de désactiver un administrateur');
    }

    await this.prisma.utilisateur.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Compte employé désactivé' };
  }

  async getOrderStats() {
    // Commandes par menu
    const stats = await this.prisma.commande.groupBy({
      by: ['menuId'],
      _count: { id: true },
      _sum: { prixMenu: true, prixLivraison: true },
    });

    // Enrich with menu titles
    const menuIds = stats.map((s) => s.menuId);
    const menus = await this.prisma.menu.findMany({
      where: { id: { in: menuIds } },
      select: { id: true, titre: true },
    });

    const menuMap = new Map(menus.map((m) => [m.id, m.titre]));

    return stats.map((s) => ({
      menuId: s.menuId,
      menuTitre: menuMap.get(s.menuId) ?? 'Menu supprimé',
      totalCommandes: s._count.id,
      chiffreAffaires: (s._sum.prixMenu ?? 0) + (s._sum.prixLivraison ?? 0),
    }));
  }

  async getRevenueStats(menuId?: number) {
    const where: any = {};
    if (menuId) where.menuId = menuId;

    const commandes = await this.prisma.commande.findMany({
      where,
      select: {
        dateCommande: true,
        prixMenu: true,
        prixLivraison: true,
        menu: { select: { titre: true } },
      },
      orderBy: { dateCommande: 'asc' },
    });

    return commandes.map((c) => ({
      date: c.dateCommande,
      menu: c.menu.titre,
      montant: c.prixMenu + c.prixLivraison,
    }));
  }
}
