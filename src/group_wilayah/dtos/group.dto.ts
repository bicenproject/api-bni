
import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateGroupWilayahDto {
  @IsString()
  name_group: string;

  @IsInt()
  created_by: number;

  @IsInt()
  updated_by: number;
}

export class UpdateGroupWilayahDto {
  @IsOptional()
  @IsString()
  name_group?: string;

  @IsInt()
  updated_by: number;
}
