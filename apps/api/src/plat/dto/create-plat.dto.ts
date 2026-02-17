import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export enum PlatTypeEnum {
  ENTREE = 'ENTREE',
  PLAT = 'PLAT',
  DESSERT = 'DESSERT',
}

export class CreatePlatDto {
  @IsString()
  @IsNotEmpty()
  titrePlat: string;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsEnum(PlatTypeEnum)
  type: PlatTypeEnum;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  allergeneIds?: number[];
}
