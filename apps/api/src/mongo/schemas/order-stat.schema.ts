import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderStatDocument = HydratedDocument<OrderStat>;

@Schema({ collection: 'order_stats', timestamps: true })
export class OrderStat {
  @Prop({ required: true })
  commandeId: number;

  @Prop({ required: true })
  menuId: number;

  @Prop({ required: true })
  menuTitre: string;

  @Prop({ required: true })
  dateCommande: Date;

  @Prop()
  datePrestation: Date;

  @Prop({ required: true })
  nombrePersonnes: number;

  @Prop({ required: true })
  prixMenu: number;

  @Prop({ required: true })
  prixLivraison: number;

  @Prop({ required: true })
  montantTotal: number;

  @Prop({ required: true })
  statut: string;

  @Prop()
  clientId: number;

  @Prop()
  clientNom: string;
}

export const OrderStatSchema = SchemaFactory.createForClass(OrderStat);
