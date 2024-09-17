import {  
    Injectable,  
    NotFoundException,  
    BadRequestException,  
  } from '@nestjs/common';  
  import { PrismaService } from '../prisma/prisma.service'; // Adjust the path as necessary  
  import { Inventory_EDC } from '@prisma/client'; // Adjust the import based on your Prisma setup  
  import { CreateInventoryEDCDto } from './dtos/CreateInventoryDto'; // Adjust the path as necessary  
  import { UpdateInventoryEDCDto } from './dtos/UpdateInventoryDto'; // Adjust the path as necessary  
  
  @Injectable()  
  export class InventoryService {  
    constructor(private prisma: PrismaService) {}  
  
    async getAllInventory(): Promise<Inventory_EDC[]> {  
      return this.prisma.inventory_EDC.findMany({  
        where: { deleted_at: null },  
      });  
    }  
  
    async getInventoryById(id_inventory_edc: number): Promise<Inventory_EDC> {  
      const inventory = await this.prisma.inventory_EDC.findUnique({  
        where: { id_inventory_edc, deleted_at: null },  
      });  
      if (!inventory)  
        throw new NotFoundException(`Inventory with ID ${id_inventory_edc} not found`);  
      return inventory;  
    }  
  
    
    async createInventory(data: CreateInventoryEDCDto): Promise<Inventory_EDC> {  
      try {  
        const createdInventory = await this.prisma.inventory_EDC.create({  
          data: {  
            mid: data.mid,  
            tid: data.tid,  
            merk_edc: data.merk_edc,  
            type_edc: data.type_edc,  
            serial_number: data.serial_number,  
            status_owner: data.status_owner,  
            kondisi_mesin: data.kondisi_mesin,  
            kelengkapan: data.kelengkapan,  
            jenis_kerusakan: data.jenis_kerusakan,  
            penggunaan: data.penggunaan,  
            tempat: data.tempat,  
            scope: data.scope,  
            status: data.status,  
            tanggal_masuk: new Date(data.tanggal_masuk),  
            provider_simcard: data.provider_simcard ?? null,  
            no_simcard: data.no_simcard ?? null,  
            created_by: data.created_by,  
            updated_by: data.updated_by,  
            id_wilayah: data.id_wilayah ?? null,  
            id_vendor: data.id_vendor ?? null,  
            id_merchant: data.id_merchant ?? null,  
            deleted_at: null,  
          },  
        });  
    
        return createdInventory;  
      } catch (error) {  
        throw new BadRequestException(`Failed to create inventory: ${error.message}`);  
      }  
    }
     async updateInventory(id_inventory_edc: number, data: UpdateInventoryEDCDto): Promise<Inventory_EDC> {  
      await this.getInventoryById(id_inventory_edc); // Ensure inventory exists  
      return this.prisma.inventory_EDC.update({  
        where: { id_inventory_edc },  
        data: { ...data, updated_at: new Date() }, // Pastikan data yang dikirim sesuai  
      });  
    }
  
    async deleteInventory(id_inventory_edc: number): Promise<Inventory_EDC> {  
      await this.getInventoryById(id_inventory_edc); // Ensure inventory exists  
      return this.prisma.inventory_EDC.update({  
        where: { id_inventory_edc },  
        data: { deleted_at: new Date() },  
      });  
    }  
  }