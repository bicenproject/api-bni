
import { IsString, IsInt, IsOptional } from 'class-validator';

export class UpdateWilayahDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  id_group?: number;

  @IsInt()
  updated_by: number;
}
