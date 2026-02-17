import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderStat, OrderStatDocument } from './schemas/order-stat.schema';

@Injectable()
export class MongoService {
  constructor(
    @InjectModel(OrderStat.name)
    private readonly orderStatModel: Model<OrderStatDocument>,
  ) {}

  /**
   * Upsert an order stat document when a commande is created or updated.
   */
  async upsertOrderStat(data: {
    commandeId: number;
    menuId: number;
    menuTitre: string;
    dateCommande: Date;
    datePrestation: Date;
    nombrePersonnes: number;
    prixMenu: number;
    prixLivraison: number;
    statut: string;
    clientId: number;
    clientNom: string;
  }) {
    await this.orderStatModel.findOneAndUpdate(
      { commandeId: data.commandeId },
      {
        ...data,
        montantTotal: data.prixMenu + data.prixLivraison,
      },
      { upsert: true, new: true },
    );
  }

  /**
   * Get order count and revenue grouped by menu.
   */
  async getOrderStatsByMenu() {
    return this.orderStatModel.aggregate([
      {
        $group: {
          _id: { menuId: '$menuId', menuTitre: '$menuTitre' },
          totalCommandes: { $sum: 1 },
          chiffreAffaires: { $sum: '$montantTotal' },
        },
      },
      {
        $project: {
          _id: 0,
          menuId: '$_id.menuId',
          menuTitre: '$_id.menuTitre',
          totalCommandes: 1,
          chiffreAffaires: 1,
        },
      },
      { $sort: { totalCommandes: -1 } },
    ]);
  }

  /**
   * Get revenue entries with optional filters (menuId, date range).
   */
  async getRevenueStats(filters?: {
    menuId?: number;
    dateDebut?: Date;
    dateFin?: Date;
  }) {
    const match: Record<string, unknown> = {};

    if (filters?.menuId) {
      match.menuId = filters.menuId;
    }
    if (filters?.dateDebut || filters?.dateFin) {
      match.dateCommande = {};
      if (filters.dateDebut) {
        (match.dateCommande as Record<string, unknown>).$gte = filters.dateDebut;
      }
      if (filters.dateFin) {
        (match.dateCommande as Record<string, unknown>).$lte = filters.dateFin;
      }
    }

    return this.orderStatModel.aggregate([
      ...(Object.keys(match).length > 0 ? [{ $match: match }] : []),
      {
        $project: {
          _id: 0,
          date: '$dateCommande',
          menu: '$menuTitre',
          montant: '$montantTotal',
          nombrePersonnes: 1,
          statut: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);
  }

  /**
   * Sync all existing commandes from PostgreSQL data into MongoDB.
   * Called once to populate initial data.
   */
  async bulkUpsert(stats: Array<{
    commandeId: number;
    menuId: number;
    menuTitre: string;
    dateCommande: Date;
    datePrestation: Date;
    nombrePersonnes: number;
    prixMenu: number;
    prixLivraison: number;
    statut: string;
    clientId: number;
    clientNom: string;
  }>) {
    const ops = stats.map((s) => ({
      updateOne: {
        filter: { commandeId: s.commandeId },
        update: { $set: { ...s, montantTotal: s.prixMenu + s.prixLivraison } },
        upsert: true,
      },
    }));
    if (ops.length > 0) {
      await this.orderStatModel.bulkWrite(ops);
    }
  }
}
