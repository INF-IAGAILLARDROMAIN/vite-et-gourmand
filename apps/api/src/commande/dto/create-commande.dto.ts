import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateCommandeDto {
  @IsInt()
  menuId: number;

  @IsInt()
  @Min(1)
  nombrePersonnes: number;

  @IsDateString()
  datePrestation: string;

  @IsString()
  @IsNotEmpty()
  heurePrestation: string;

  @IsString()
  @IsNotEmpty()
  adresse: string;

  @IsOptional()
  @IsString()
  modeContact?: string;
}
