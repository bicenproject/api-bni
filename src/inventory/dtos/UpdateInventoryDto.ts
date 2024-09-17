import { IsOptional, IsString, IsDateString } from 'class-validator';  

export class UpdateInventoryEDCDto {  
  @IsOptional()  
  @IsString()  
  mid?: string;  

  @IsOptional()  
  @IsString()  
  merk_edc?: string;  

  @IsOptional()  
  @IsString()  
  tipe_edc?: string;  

  @IsOptional()  
  @IsString()  
  serial_number?: string;  

  @IsOptional()  
  @IsString()  
  tid?: string;  

  @IsOptional()  
  @IsString()  
  status_owner?: string;  

  @IsOptional()  
  @IsString()  
  kondisi_mesin?: string;  

  @IsOptional()  
  @IsString()  
  kelengkapan?: string;  

  @IsOptional()  
  @IsString()  
  jenis_kerusakan?: string; // Tambahkan ini jika diperlukan  

  @IsOptional()  
  @IsString()  
  penggunaan?: string;  

  @IsOptional()  
  @IsString()  
  tempat?: string;  

  @IsOptional()  
  @IsString()  
  scope?: string; // Tambahkan ini jika diperlukan  

  @IsOptional()  
  @IsString()  
  status?: string;  

  @IsOptional()  
  @IsDateString({}, { message: 'Tanggal Masuk harus dalam format dd/mm/yyyy' })  
  tanggal_masuk?: string;  

  @IsOptional()  
  @IsString()  
  provider_simcard?: string;  

  @IsOptional()  
  @IsString()  
  no_simcard?: string;  

  @IsOptional()  
  created_by?: number; // Jika ini diperlukan  

  @IsOptional()  
  updated_by?: number; // Jika ini diperlukan  

  @IsOptional()  
  id_wilayah?: number; // Jika ini opsional  
  @IsOptional()  
  id_vendor?: number; // Jika ini opsional  
  @IsOptional()  
  id_merchant?: number; // Jika ini opsional  
}