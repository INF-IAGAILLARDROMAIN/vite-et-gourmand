import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHoraireDto {
  @IsString()
  @IsNotEmpty()
  jour: string;

  @IsString()
  @IsNotEmpty()
  heureOuverture: string;

  @IsString()
  @IsNotEmpty()
  heureFermeture: string;
}
