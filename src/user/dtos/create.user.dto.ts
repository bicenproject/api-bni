import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsEmail, IsDate, IsBoolean, IsInt } from 'class-validator';  

export class CreateUserDto {  
  @IsNotEmpty()  
  @IsString()  
  username: string;  

  @IsNotEmpty()  
  @IsEmail()  
  email: string;  

  @IsNotEmpty()  
  @IsString()  
  npp: string;  

  @IsNotEmpty()  
  @Type(() => Date)  
  @IsDate()  
  dob: Date;  

  @IsNotEmpty()  
  @IsString()  
  password: string;  

  @IsOptional()  
  id_role?: number; // Pastikan ini sesuai dengan tipe yang diharapkan  

  @IsInt()
  @IsOptional()  
  id_wilayah?: number;  

  @IsOptional()  
  id_vendor?: number;  

  @IsOptional()  
  id_wilayah_vendor?: number;  

  @IsOptional()  
  vendor_type?: string;  

  @IsOptional()  
  created_by: number; // Pastikan ini sesuai dengan tipe yang diharapkan  

  @IsOptional()  
  updated_by: number; // Pastikan ini sesuai dengan tipe yang diharapkan  

  @IsOptional()  
  isVerified?: boolean; // Defaultnya false jika tidak diisi  
}