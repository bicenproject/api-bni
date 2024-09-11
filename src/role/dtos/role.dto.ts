import { Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  ValidateNested,
  IsArray,
} from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  created_by: number;

  @IsInt()
  updated_by: number;
}

export class UpdateRoleDto {
  @IsNumber()
  @IsOptional()
  id_role?: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  updated_by?: number;
}

export class RoleWithActionsDto {
  @IsNotEmpty()
  role: CreateRoleDto | UpdateRoleDto;

  @IsNotEmpty()
  selectedActions: number[];

  @IsNotEmpty()
  selectedMenus: number[];
}

export class UpdateRoleWithAccessDto {  
  @ValidateNested()  
  @Type(() => UpdateRoleDto)  
  role: UpdateRoleDto;  

  @IsArray()  
  @IsNumber({}, { each: true })  
  selectedMenus: number[];  

  @IsArray()  
  @IsNumber({}, { each: true })  
  selectedActions: number[];  
}  