
import { IsString, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class CreateMenuActionDto {
  @IsInt()
  id_menu: number;

  @IsString()
  name: string;

  @IsString()
  action: string;

  @IsBoolean()
  isActive: boolean;

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
  @IsBoolean()
  isActive?: boolean;

  @IsInt()
  updated_by: number;
}
