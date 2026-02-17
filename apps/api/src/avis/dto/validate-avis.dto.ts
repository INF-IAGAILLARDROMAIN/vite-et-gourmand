import { IsEnum } from 'class-validator';

export enum AvisStatutEnum {
  VALIDE = 'VALIDE',
  REFUSE = 'REFUSE',
}

export class ValidateAvisDto {
  @IsEnum(AvisStatutEnum)
  statut: AvisStatutEnum;
}
