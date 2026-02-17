import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateCommandeDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  nombrePersonnes?: number;

  @IsDateString()
  @IsOptional()
  datePrestation?: string;

  @IsString()
  @IsOptional()
  heurePrestation?: string;

  @IsString()
  @IsOptional()
  adresse?: string;
}
