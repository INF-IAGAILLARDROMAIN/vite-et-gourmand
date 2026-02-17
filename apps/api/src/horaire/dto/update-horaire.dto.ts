import { IsOptional, IsString } from 'class-validator';

export class UpdateHoraireDto {
  @IsString()
  @IsOptional()
  jour?: string;

  @IsString()
  @IsOptional()
  heureOuverture?: string;

  @IsString()
  @IsOptional()
  heureFermeture?: string;
}
