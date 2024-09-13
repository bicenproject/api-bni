
import { IsNotEmpty, IsString, MaxLength, IsOptional, IsNumber } from 'class-validator';

export class CreateVendorDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  code: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateVendorDto {
  @IsOptional()
  @IsNumber()
  id_vendor?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  code?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
