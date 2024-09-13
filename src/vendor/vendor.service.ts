import { Vendor} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateVendorDto, UpdateVendorDto } from './dtos/vendor.dto';

@Injectable()
export class VendorService {
  constructor(private prisma: PrismaService) {}

  async getAllVendor(): Promise<Vendor[]> {
    return this.prisma.vendor.findMany();
  }

  async getVendorByid(id_vendor: number): Promise<Vendor> {
    return this.prisma.vendor.findUnique({
      where: {
        id_vendor: id_vendor,
      },
    });
  }

  async createVendor(data: CreateVendorDto): Promise<Vendor> {  
    return this.prisma.vendor.create({  
      data: {  
        ...data,  
        created_by: 1,  
        updated_by: 1,         
      },  
    });  
  }  

  async updateVendor(id_vendor: number, data: UpdateVendorDto): Promise<Vendor> {  
    const { id_vendor: _, ...updateData } = data; // Exclude id_vendor from updateData  
    return this.prisma.vendor.update({  
      where: { id_vendor },  
      data: {  
        ...updateData,  
        updated_by: 1,  
        updated_at: new Date(), // Update the updated_at timestamp  
      },  
    });  
  }  

  async deleteVendor(id_vendor: number): Promise<Vendor> {
    return this.prisma.vendor.delete({
      where: {
        id_vendor: id_vendor,
      },
    });
  }
}