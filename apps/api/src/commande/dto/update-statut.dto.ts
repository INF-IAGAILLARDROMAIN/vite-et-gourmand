import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum CommandeStatutEnum {
  RECUE = 'RECUE',
  ACCEPTEE = 'ACCEPTEE',
  EN_PREPARATION = 'EN_PREPARATION',
  EN_LIVRAISON = 'EN_LIVRAISON',
  LIVREE = 'LIVREE',
  ATTENTE_RETOUR_MATERIEL = 'ATTENTE_RETOUR_MATERIEL',
  TERMINEE = 'TERMINEE',
  ANNULEE = 'ANNULEE',
}

export class UpdateStatutDto {
  @IsEnum(CommandeStatutEnum)
  statut: CommandeStatutEnum;

  @IsString()
  @IsOptional()
  motifAnnulation?: string;

  @IsString()
  @IsOptional()
  modeContact?: string;
}
