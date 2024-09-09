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
      data,
    });
  }

  async updateVendor(id_vendor: number, data: UpdateVendorDto): Promise<Vendor> {
    return this.prisma.vendor.update({
      where: {
        id_vendor: id_vendor,
      },
      data,
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