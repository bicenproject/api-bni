
import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateMenuActionDto {
  @IsOptional()
  @IsInt()
  id_menu?: number;

  @IsString()
  name: string;

  @IsString()
  action: string;

  @IsInt()
  isActive: number;

  @IsInt()
  created_by: number;

  @IsInt()
  updated_by: number;
}

export class UpdateMenuActionDto {
  @IsOptional()
  @IsInt()
  id_menu?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @IsInt()
  isActive?: number;

  @IsInt()
  updated_by: number;
}
