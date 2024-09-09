
import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  name: string;

  @IsString()
  routh: string;

  @IsString()
  path: string;

  @IsString()
  api_path: string;

  @IsString()
  icon: string;

  @IsInt()
  parent: number;

  @IsString()
  platform: string;

  @IsInt()
  active: number;

  @IsInt()
  order: number;
}

export class UpdateMenuDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  routh?: string;

  @IsOptional()
  @IsString()
  path?: string;

  @IsOptional()
  @IsString()
  api_path?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsInt()
  parent?: number;

  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsInt()
  active?: number;

  @IsOptional()
  @IsInt()
  order?: number;
}
