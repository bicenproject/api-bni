
import { IsInt, IsOptional } from 'class-validator';

export class CreateMenuRoleDto {
  @IsOptional()
  @IsInt()
  id_menu?: number;

  @IsOptional()
  @IsInt()
  id_role?: number;
}

export class UpdateMenuRoleDto {
  @IsOptional()
  @IsInt()
  id_menu?: number;

  @IsOptional()
  @IsInt()
  id_role?: number;
}
