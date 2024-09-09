
import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateVendorDto {
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
}

export class UpdateVendorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  updated_by: number;
}
