import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { MongoService } from '../mongo/mongo.service';
import { CreateEmployeeDto } from './dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly mongoService: MongoService,
  ) {}

  async getEmployees() {
    const employees = await this.prisma.utilisateur.findMany({
      where: {
        role: { libelle: 'employe' },
      },
      include: { role: true },
      orderBy: { createdAt: 'desc' },
    });

    return employees.map((e) => ({
      id: e.id,
      email: e.email,
      nom: e.nom,
      prenom: e.prenom,
      telephone: e.telephone,
      isActive: e.isActive,
      createdAt: e.createdAt,
      role: e.role.libelle,
    }));
  }

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

  /**
   * Get order stats grouped by menu — reads from MongoDB (NoSQL).
   * Falls back to PostgreSQL aggregation if MongoDB is unavailable.
   */
  async getOrderStats() {
    const mongoStats = await this.mongoService.getOrderStatsByMenu();
    if (mongoStats.length > 0) return mongoStats;

    // Fallback: aggregate from PostgreSQL via Prisma
    const commandes = await this.prisma.commande.groupBy({
      by: ['menuId'],
      _count: { id: true },
      _sum: { prixMenu: true, prixLivraison: true },
    });

    const menuIds = commandes.map((c) => c.menuId);
    const menus = await this.prisma.menu.findMany({
      where: { id: { in: menuIds } },
      select: { id: true, titre: true },
    });
    const menuMap = new Map(menus.map((m) => [m.id, m.titre]));

    return commandes.map((c) => ({
      menuId: c.menuId,
      menuTitre: menuMap.get(c.menuId) ?? `Menu #${c.menuId}`,
      totalCommandes: c._count.id,
      chiffreAffaires:
        Number(c._sum.prixMenu ?? 0) + Number(c._sum.prixLivraison ?? 0),
    }));
  }

  /**
   * Get revenue entries with optional filters — reads from MongoDB (NoSQL).
   * Falls back to PostgreSQL if MongoDB is unavailable.
   */
  async getRevenueStats(filters?: {
    menuId?: number;
    dateDebut?: string;
    dateFin?: string;
  }) {
    const mongoStats = await this.mongoService.getRevenueStats({
      menuId: filters?.menuId,
      dateDebut: filters?.dateDebut ? new Date(filters.dateDebut) : undefined,
      dateFin: filters?.dateFin ? new Date(filters.dateFin) : undefined,
    });
    if (mongoStats.length > 0) return mongoStats;

    // Fallback: query from PostgreSQL via Prisma
    const where: Record<string, unknown> = {};
    if (filters?.menuId) where.menuId = filters.menuId;
    if (filters?.dateDebut || filters?.dateFin) {
      where.dateCommande = {};
      if (filters?.dateDebut) (where.dateCommande as Record<string, unknown>).gte = new Date(filters.dateDebut);
      if (filters?.dateFin) (where.dateCommande as Record<string, unknown>).lte = new Date(filters.dateFin);
    }

    const commandes = await this.prisma.commande.findMany({
      where,
      include: { menu: { select: { titre: true } } },
      orderBy: { dateCommande: 'asc' },
    });

    return commandes.map((c) => ({
      date: c.dateCommande,
      menu: c.menu.titre,
      montant: Number(c.prixMenu) + Number(c.prixLivraison),
      nombrePersonnes: c.nombrePersonnes,
      statut: c.statut,
    }));
  }

  /**
   * Sync all commandes from PostgreSQL into MongoDB.
   * Useful for initial population or data recovery.
   */
  async syncOrderStats() {
    const commandes = await this.prisma.commande.findMany({
      include: {
        menu: { select: { titre: true } },
        utilisateur: { select: { id: true, nom: true, prenom: true } },
      },
    });

    const stats = commandes.map((c) => ({
      commandeId: c.id,
      menuId: c.menuId,
      menuTitre: c.menu.titre,
      dateCommande: c.dateCommande,
      datePrestation: c.datePrestation,
      nombrePersonnes: c.nombrePersonnes,
      prixMenu: c.prixMenu,
      prixLivraison: c.prixLivraison,
      statut: c.statut,
      clientId: c.utilisateur.id,
      clientNom: `${c.utilisateur.prenom} ${c.utilisateur.nom}`,
    }));

    await this.mongoService.bulkUpsert(stats);

    return { message: `${stats.length} commandes synchronisées vers MongoDB` };
  }
}
