
import { IsString, IsInt, IsOptional, IsDateString } from 'class-validator';

export class CreateWilayahDto {
  @IsOptional()
  @IsInt()
  id_group?: number;

  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  created_by: number;

  @IsInt()
  updated_by: number;

  @IsOptional()
  @IsDateString()
  deleted_at?: Date;
}
