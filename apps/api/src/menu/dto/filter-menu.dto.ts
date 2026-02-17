import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterMenuDto {
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  prixMin?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  prixMax?: number;

  @IsString()
  @IsOptional()
  theme?: string;

  @IsString()
  @IsOptional()
  regime?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  nbPersonnesMin?: number;
}
