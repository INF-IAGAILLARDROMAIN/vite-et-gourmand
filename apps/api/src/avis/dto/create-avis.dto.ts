import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateAvisDto {
  @IsInt()
  @Min(1)
  @Max(5)
  note: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  commandeId: number;
}
