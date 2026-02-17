import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { PlatTypeEnum } from './create-plat.dto';

export class UpdatePlatDto {
  @IsString()
  @IsOptional()
  titrePlat?: string;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsEnum(PlatTypeEnum)
  @IsOptional()
  type?: PlatTypeEnum;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  allergeneIds?: number[];
}
