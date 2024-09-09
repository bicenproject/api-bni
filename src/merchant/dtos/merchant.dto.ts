import { IsString, IsOptional, IsInt, Length } from 'class-validator';  

export class CreateMerchantDto {  
  @IsString()  
  @Length(1, 50)  
  mid: string;  

  @IsString()  
  @Length(1, 50)  
  kodewilayah: string;  

  @IsString()  
  @Length(1, 100)  
  merchantname: string;  

  @IsString()  
  @Length(1, 100)  
  namanasabah: string;  

  @IsString()  
  @Length(1, 50)  
  contact: string;  

  @IsString()  
  @Length(1, 50)  
  phone: string;  

  @IsString()  
  @Length(1, 50)  
  kodecbg: string;  

  @IsString()  
  @Length(1, 50)  
  kategori: string;  

  @IsOptional()  
  @IsString()  
  address1?: string;  

  @IsOptional()  
  @IsString()  
  address2?: string;  

  @IsOptional()  
  @IsString()  
  address3?: string;  

  @IsOptional()  
  @IsString()  
  address4?: string;  

  @IsInt()  
  created_by: number;  

  @IsInt()  
  updated_by: number;  
}  

export class UpdateMerchantDto {  
  @IsOptional()  
  @IsString()  
  @Length(1, 50)  
  mid?: string;  

  @IsOptional()  
  @IsString()  
  @Length(1, 50)  
  kodewilayah?: string;  

  @IsOptional()  
  @IsString()  
  @Length(1, 100)  
  merchantname?: string;  

  @IsOptional()  
  @IsString()  
  @Length(1, 100)  
  namanasabah?: string;  

  @IsOptional()  
  @IsString()  
  @Length(1, 50)  
  contact?: string;  

  @IsOptional()  
  @IsString()  
  @Length(1, 50)  
  phone?: string;  

  @IsOptional()  
  @IsString()  
  @Length(1, 50)  
  kodecbg?: string;  

  @IsOptional()  
  @IsString()  
  @Length(1, 50)  
  kategori?: string;  

  @IsOptional()  
  @IsString()  
  address1?: string;  

  @IsOptional()  
  @IsString()  
  address2?: string;  

  @IsOptional()  
  @IsString()  
  address3?: string;  

  @IsOptional()  
  @IsString()  
  address4?: string;  

  @IsInt()  
  updated_by: number;  
}