import { Type } from 'class-transformer';
import { IsOptional, IsString, IsEmail, IsDate, IsBoolean } from 'class-validator';  

export class UpdateUserDto {  
  @IsOptional()  
  @IsString()  
  username?: string;  

  @IsOptional()  
  @IsEmail()  
  email?: string;  

  @IsOptional()  
  @IsString()  
  npp?: string;  

  @IsOptional()  
  @Type(() => Date)  
  @IsDate()  
  dob?: Date; 
  
  @IsOptional()  
  @IsString()  
  password?: string;  

  @IsOptional()  
  id_role?: number;  

  @IsOptional()  
  id_wilayah?: number;  

  @IsOptional()  
  id_vendor?: number;  

  @IsOptional()  
  id_wilayah_vendor?: number;  

  @IsOptional()  
  vendor_type?: string;  

  @IsOptional()  
  updated_by?: number; // Pastikan ini sesuai dengan tipe yang diharapkan  

  @IsOptional()  
  isVerified?: boolean; // Defaultnya false jika tidak diisi  
}