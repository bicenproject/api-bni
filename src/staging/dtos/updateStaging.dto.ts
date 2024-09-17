
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateStagingDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  staging?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  updated_by: number;
}
