import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateMenuDto {
  @IsString()
  @IsOptional()
  titre?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  nombrePersonneMinimale?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  prixParPersonne?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  quantiteRestante?: number;

  @IsString()
  @IsOptional()
  conditions?: string;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  themeIds?: number[];

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  regimeIds?: number[];

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  platIds?: number[];
}
