
import { IsString, IsInt, IsOptional, IsDateString } from 'class-validator';

export class UpdateWilayahDto {
  @IsOptional()
  @IsInt()
  id_group?: number;

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
  updated_by?: number;

  @IsOptional()
  @IsDateString()
  deleted_at?: Date;
}
