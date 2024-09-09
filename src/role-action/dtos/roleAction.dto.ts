
import { IsInt, IsOptional } from 'class-validator';

export class CreateRoleActionDto {
  @IsOptional()
  @IsInt()
  id_role?: number;

  @IsOptional()
  @IsInt()
  id_menu_action?: number;
}

export class UpdateRoleActionDto {
  @IsOptional()
  @IsInt()
  id_role?: number;

  @IsOptional()
  @IsInt()
  id_menu_action?: number;
}
