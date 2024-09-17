
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStagingDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  staging: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  created_by: number;

  @IsNotEmpty()
  @IsNumber()
  updated_by: number;
}
