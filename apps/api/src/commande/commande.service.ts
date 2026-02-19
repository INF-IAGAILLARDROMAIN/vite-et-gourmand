import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { MongoService } from '../mongo/mongo.service';
import { CreateCommandeDto, UpdateCommandeDto, UpdateStatutDto } from './dto';

// Bordeaux city — orders here get free delivery
const BORDEAUX_KEYWORDS = ['bordeaux', '33000', '33100', '33200', '33300', '33800'];
const DELIVERY_BASE = 5;
const DELIVERY_PER_KM = 0.59;
const DELIVERY_DEFAULT_KM = 20; // flat estimate for non-Bordeaux
const DISCOUNT_THRESHOLD = 5; // nb_personnes >= min + 5 => 10% discount
const DISCOUNT_RATE = 0.1;

// Statuts that allow modification/cancellation by user
const MODIFIABLE_STATUTS = ['RECUE'];

// Valid status transitions
const STATUS_FLOW: Record<string, string[]> = {
  RECUE: ['ACCEPTEE', 'ANNULEE'],
  ACCEPTEE: ['EN_PREPARATION', 'ANNULEE'],
  EN_PREPARATION: ['EN_LIVRAISON'],
  EN_LIVRAISON: ['LIVREE'],
  LIVREE: ['ATTENTE_RETOUR_MATERIEL', 'TERMINEE'],
  ATTENTE_RETOUR_MATERIEL: ['TERMINEE'],
};

@Injectable()
export class CommandeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly mongoService: MongoService,
  ) {}

  async create(dto: CreateCommandeDto, userId: number) {
    // Get user info
    const user = await this.prisma.utilisateur.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    // Get menu and check stock
    const menu = await this.prisma.menu.findUnique({
      where: { id: dto.menuId },
    });
    if (!menu) throw new NotFoundException('Menu introuvable');

    if (dto.nombrePersonnes < menu.nombrePersonneMinimale) {
      throw new BadRequestException(
        `Le nombre minimum de personnes pour ce menu est ${menu.nombrePersonneMinimale}`,
      );
    }

    if (menu.quantiteRestante <= 0) {
      throw new BadRequestException('Ce menu n\'est plus disponible (stock épuisé)');
    }

    // Calculate prices
    const prixMenu = menu.prixParPersonne * dto.nombrePersonnes;

    // Apply 10% discount if nb_personnes >= minimum + 5
    const hasDiscount = dto.nombrePersonnes >= menu.nombrePersonneMinimale + DISCOUNT_THRESHOLD;
    const prixMenuFinal = hasDiscount ? prixMenu * (1 - DISCOUNT_RATE) : prixMenu;

    // Calculate delivery price
    const adresseLower = dto.adresse.toLowerCase();
    const isBordeaux = BORDEAUX_KEYWORDS.some((kw) => adresseLower.includes(kw));
    const prixLivraison = isBordeaux ? 0 : DELIVERY_BASE + DELIVERY_PER_KM * DELIVERY_DEFAULT_KM;

    // Generate order number
    const numeroCommande = `CMD-${uuidv4().slice(0, 8).toUpperCase()}`;

    // Create order and decrement stock in a transaction
    const commande = await this.prisma.$transaction(async (tx) => {
      // Decrement stock
      await tx.menu.update({
        where: { id: menu.id },
        data: { quantiteRestante: { decrement: 1 } },
      });

      // Create order
      const order = await tx.commande.create({
        data: {
          numeroCommande,
          datePrestation: new Date(dto.datePrestation),
          heurePrestation: dto.heurePrestation,
          adresse: dto.adresse,
          prixMenu: prixMenuFinal,
          nombrePersonnes: dto.nombrePersonnes,
          prixLivraison,
          modeContact: dto.modeContact,
          utilisateurId: userId,
          menuId: menu.id,
          historiqueStatuts: {
            create: { statut: 'RECUE' },
          },
        },
        include: {
          menu: true,
          utilisateur: true,
          historiqueStatuts: { orderBy: { date: 'asc' } },
        },
      });

      return order;
    });

    // Send confirmation email (async)
    this.mailService.sendOrderConfirmationEmail(
      user.email,
      user.prenom,
      commande.numeroCommande,
      prixMenuFinal + prixLivraison,
    );

    // Sync to MongoDB for NoSQL stats
    this.mongoService.upsertOrderStat({
      commandeId: commande.id,
      menuId: menu.id,
      menuTitre: menu.titre,
      dateCommande: commande.dateCommande,
      datePrestation: commande.datePrestation,
      nombrePersonnes: dto.nombrePersonnes,
      prixMenu: prixMenuFinal,
      prixLivraison,
      statut: 'RECUE',
      clientId: userId,
      clientNom: `${user.prenom} ${user.nom}`,
    }).catch(() => { /* non-blocking: MongoDB sync failure should not break order creation */ });

    return commande;
  }

  async findAll(userId: number, role: string, statut?: string) {
    const where: any = {};

    // Regular users can only see their own orders
    if (role === 'utilisateur') {
      where.utilisateurId = userId;
    }

    if (statut) {
      where.statut = statut;
    }

    return this.prisma.commande.findMany({
      where,
      include: {
        menu: true,
        utilisateur: { select: { id: true, nom: true, prenom: true, email: true } },
        historiqueStatuts: { orderBy: { date: 'asc' } },
        avis: true,
      },
      orderBy: { dateCommande: 'desc' },
    });
  }

  async findOne(id: number, userId: number, role: string) {
    const commande = await this.prisma.commande.findUnique({
      where: { id },
      include: {
        menu: {
          include: {
            plats: { include: { plat: true } },
            themes: { include: { theme: true } },
          },
        },
        utilisateur: { select: { id: true, nom: true, prenom: true, email: true, telephone: true } },
        historiqueStatuts: { orderBy: { date: 'asc' } },
        avis: true,
      },
    });

    if (!commande) throw new NotFoundException('Commande introuvable');

    // Regular users can only see their own orders
    if (role === 'utilisateur' && commande.utilisateurId !== userId) {
      throw new ForbiddenException('Accès refusé');
    }

    return commande;
  }

  async update(id: number, dto: UpdateCommandeDto, userId: number) {
    const commande = await this.prisma.commande.findUnique({ where: { id } });

    if (!commande) throw new NotFoundException('Commande introuvable');
    if (commande.utilisateurId !== userId) throw new ForbiddenException('Accès refusé');
    if (!MODIFIABLE_STATUTS.includes(commande.statut)) {
      throw new BadRequestException('Cette commande ne peut plus être modifiée');
    }

    const data: any = {};
    if (dto.nombrePersonnes !== undefined) data.nombrePersonnes = dto.nombrePersonnes;
    if (dto.datePrestation) data.datePrestation = new Date(dto.datePrestation);
    if (dto.heurePrestation) data.heurePrestation = dto.heurePrestation;
    if (dto.adresse) data.adresse = dto.adresse;

    // Recalculate price if nombre changed
    if (dto.nombrePersonnes !== undefined) {
      const menu = await this.prisma.menu.findUnique({ where: { id: commande.menuId } });
      if (menu) {
        const prixMenu = menu.prixParPersonne * dto.nombrePersonnes;
        const hasDiscount = dto.nombrePersonnes >= menu.nombrePersonneMinimale + DISCOUNT_THRESHOLD;
        data.prixMenu = hasDiscount ? prixMenu * (1 - DISCOUNT_RATE) : prixMenu;
      }
    }

    // Recalculate delivery if address changed
    if (dto.adresse) {
      const adresseLower = dto.adresse.toLowerCase();
      const isBordeaux = BORDEAUX_KEYWORDS.some((kw) => adresseLower.includes(kw));
      data.prixLivraison = isBordeaux ? 0 : DELIVERY_BASE + DELIVERY_PER_KM * DELIVERY_DEFAULT_KM;
    }

    return this.prisma.commande.update({
      where: { id },
      data,
      include: {
        menu: true,
        historiqueStatuts: { orderBy: { date: 'asc' } },
      },
    });
  }

  async cancel(id: number, userId: number) {
    const commande = await this.prisma.commande.findUnique({
      where: { id },
      include: { utilisateur: true },
    });

    if (!commande) throw new NotFoundException('Commande introuvable');
    if (commande.utilisateurId !== userId) throw new ForbiddenException('Accès refusé');
    if (!MODIFIABLE_STATUTS.includes(commande.statut)) {
      throw new BadRequestException('Cette commande ne peut plus être annulée');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      // Restore stock
      await tx.menu.update({
        where: { id: commande.menuId },
        data: { quantiteRestante: { increment: 1 } },
      });

      return tx.commande.update({
        where: { id },
        data: {
          statut: 'ANNULEE',
          historiqueStatuts: { create: { statut: 'ANNULEE' } },
        },
      });
    });

    // Send cancellation confirmation email (async, non-blocking)
    this.mailService.sendOrderCancelledEmail(
      commande.utilisateur.email,
      commande.utilisateur.prenom,
      commande.numeroCommande,
    ).catch(() => {});

    return result;
  }

  async updateStatut(id: number, dto: UpdateStatutDto) {
    const commande = await this.prisma.commande.findUnique({
      where: { id },
      include: { utilisateur: true },
    });

    if (!commande) throw new NotFoundException('Commande introuvable');

    // Validate status transition
    const allowedNext = STATUS_FLOW[commande.statut];
    if (!allowedNext || !allowedNext.includes(dto.statut)) {
      throw new BadRequestException(
        `Transition de statut invalide : ${commande.statut} → ${dto.statut}`,
      );
    }

    // Cancellation by employee requires motif + mode de contact
    if (dto.statut === 'ANNULEE') {
      if (!dto.motifAnnulation) {
        throw new BadRequestException("Le motif d'annulation est obligatoire");
      }
      if (!dto.modeContact) {
        throw new BadRequestException('Le mode de contact est obligatoire (gsm ou email)');
      }
    }

    const data: any = {
      statut: dto.statut,
      historiqueStatuts: { create: { statut: dto.statut } },
    };

    if (dto.motifAnnulation) data.motifAnnulation = dto.motifAnnulation;
    if (dto.modeContact) data.modeContact = dto.modeContact;

    const updated = await this.prisma.commande.update({
      where: { id },
      data,
      include: {
        menu: true,
        utilisateur: true,
        historiqueStatuts: { orderBy: { date: 'asc' } },
      },
    });

    // Send emails based on status change
    if (dto.statut === 'ATTENTE_RETOUR_MATERIEL') {
      this.mailService.sendMaterielReturnEmail(
        commande.utilisateur.email,
        commande.utilisateur.prenom,
        commande.numeroCommande,
      );
    }

    if (dto.statut === 'TERMINEE') {
      this.mailService.sendOrderCompletedEmail(
        commande.utilisateur.email,
        commande.utilisateur.prenom,
        commande.numeroCommande,
      );
    }

    // Sync status update to MongoDB
    this.mongoService.upsertOrderStat({
      commandeId: updated.id,
      menuId: updated.menuId,
      menuTitre: updated.menu.titre,
      dateCommande: updated.dateCommande,
      datePrestation: updated.datePrestation,
      nombrePersonnes: updated.nombrePersonnes,
      prixMenu: updated.prixMenu,
      prixLivraison: updated.prixLivraison,
      statut: dto.statut,
      clientId: updated.utilisateurId,
      clientNom: `${updated.utilisateur.prenom} ${updated.utilisateur.nom}`,
    }).catch(() => { /* non-blocking */ });

    return updated;
  }
}
