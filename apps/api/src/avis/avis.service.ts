import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAvisDto, ValidateAvisDto } from './dto';

@Injectable()
export class AvisService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAvisDto, userId: number) {
    // Check order exists and belongs to user
    const commande = await this.prisma.commande.findUnique({
      where: { id: dto.commandeId },
      include: { avis: true },
    });

    if (!commande) throw new NotFoundException('Commande introuvable');
    if (commande.utilisateurId !== userId) throw new ForbiddenException('Accès refusé');
    if (commande.statut !== 'TERMINEE') {
      throw new BadRequestException('Vous ne pouvez donner un avis que sur une commande terminée');
    }
    if (commande.avis) {
      throw new BadRequestException('Un avis a déjà été donné pour cette commande');
    }

    return this.prisma.avis.create({
      data: {
        note: dto.note,
        description: dto.description,
        utilisateurId: userId,
        commandeId: dto.commandeId,
      },
      include: {
        utilisateur: { select: { nom: true, prenom: true } },
      },
    });
  }

  async findAllValidated() {
    return this.prisma.avis.findMany({
      where: { statut: 'VALIDE' },
      include: {
        utilisateur: { select: { nom: true, prenom: true } },
        commande: { include: { menu: { select: { titre: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllPending() {
    return this.prisma.avis.findMany({
      where: { statut: 'EN_ATTENTE' },
      include: {
        utilisateur: { select: { nom: true, prenom: true, email: true } },
        commande: { include: { menu: { select: { titre: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async validate(id: number, dto: ValidateAvisDto) {
    const avis = await this.prisma.avis.findUnique({ where: { id } });
    if (!avis) throw new NotFoundException('Avis introuvable');

    return this.prisma.avis.update({
      where: { id },
      data: { statut: dto.statut },
    });
  }
}
