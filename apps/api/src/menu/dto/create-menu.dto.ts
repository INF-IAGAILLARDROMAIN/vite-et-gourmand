import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  titre: string;

  @IsInt()
  @Min(1)
  nombrePersonneMinimale: number;

  @IsNumber()
  @Min(0)
  prixParPersonne: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(0)
  quantiteRestante: number;

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
