import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';  

export class CreateInventoryEDCDto {  
  @IsNotEmpty()  
  @IsString()  
  mid: string;  

  @IsNotEmpty()  
  @IsString()  
  merk_edc: string;  

  @IsNotEmpty()  
  @IsString()  
  type_edc: string;  

  @IsNotEmpty()  
  @IsString()  
  serial_number: string;  

  @IsNotEmpty()  
  @IsString()  
  tid: string;  

  @IsNotEmpty()  
  @IsString()  
  status_owner: string;  

  @IsNotEmpty()  
  @IsString()  
  kondisi_mesin: string;  

  @IsNotEmpty()  
  @IsString()  
  kelengkapan: string;  

  @IsNotEmpty()  
  @IsString()  
  jenis_kerusakan: string;  

  @IsNotEmpty()  
  @IsString()  
  penggunaan: string;  

  @IsNotEmpty()  
  @IsString()  
  tempat: string;  

  @IsNotEmpty()  
  @IsString()  
  scope: string;  

  @IsNotEmpty()  
  @IsString()  
  status: string;  

  @IsNotEmpty()  
  @IsDateString({}, { message: 'Tanggal Masuk harus dalam format dd/mm/yyyy' })  
  tanggal_masuk: string;  

  @IsNotEmpty()  
  @IsString()  
  provider_simcard: string;  

  @IsNotEmpty()  
  @IsString()  
  no_simcard: string;  

  @IsNotEmpty()  
  created_by: number; // Pastikan ini sesuai dengan tipe yang diharapkan  
  @IsNotEmpty()  
  updated_by: number; // Pastikan ini sesuai dengan tipe yang diharapkan  

  @IsOptional()  
  id_wilayah?: number; // Jika ini opsional  
  @IsOptional()  
  id_vendor?: number; // Jika ini opsional  
  @IsOptional()  
  id_merchant?: number; // Jika ini opsional  
}