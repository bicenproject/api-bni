import { IsString, IsInt, IsOptional, IsEmail, IsDate, IsBoolean } from 'class-validator';  

export class CreateUserDto {  
  @IsOptional()  
  @IsInt()  
  id_role?: number;  

  @IsOptional()  
  @IsInt()  
  id_wilayah?: number;  

  @IsOptional()  
  @IsInt()  
  id_vendor?: number;  

  @IsInt()  
  id_wilayah_vendor: number;  

  @IsString()  
  vendor_type: string;  

  @IsString()  
  username: string;  

  @IsEmail()  
  email: string;  

  @IsString()  
  npp: string;  

  @IsDate()  
  dob: Date;  

  @IsString()  
  password: string;  

  @IsInt()  
  created_by: number;  

  @IsInt()  
  updated_by: number;  

  @IsBoolean()  
  isVerified: boolean;  
}  