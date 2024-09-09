import { IsString, IsInt, IsOptional, IsEmail, IsDate, IsBoolean } from 'class-validator';  

export class UpdateUserDto {  
    @IsOptional()  
    @IsInt()  
    id_role?: number;  
  
    @IsOptional()  
    @IsInt()  
    id_wilayah?: number;  
  
    @IsOptional()  
    @IsInt()  
    id_vendor?: number;  
  
    @IsOptional()  
    @IsInt()  
    id_wilayah_vendor?: number;  
  
    @IsOptional()  
    @IsString()  
    vendor_type?: string;  
  
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
    @IsDate()  
    dob?: Date;  
  
    @IsOptional()  
    @IsString()  
    password?: string;  
  
    @IsOptional()  
    @IsString()  
    token?: string;  
  
    @IsOptional()  
    @IsString()  
    refreshToken?: string;  
  
    @IsOptional()  
    @IsDate()  
    refreshTokenExpiryTime?: Date;  
  
    @IsOptional()  
    @IsString()  
    device_id?: string;  
  
    @IsInt()  
    updated_by: number;  
  
    @IsOptional()  
    @IsBoolean()  
    isVerified?: boolean;  
  }  