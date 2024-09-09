
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Wilayah } from '@prisma/client';
import { CreateWilayahDto } from './dtos/create.wilayah.dto';
import { UpdateWilayahDto } from './dtos/update.wilayah.dto';
@Injectable()
export class WilayahService {
  constructor(private prisma: PrismaService) {}

  async getAllWilayah(): Promise<Wilayah[]> {
    return this.prisma.wilayah.findMany({
      where: { deleted_at: null },
    });
  }

  async getWilayahById(id_wilayah: number): Promise<Wilayah> {
    const wilayah = await this.prisma.wilayah.findUnique({
      where: { id_wilayah, deleted_at: null },
    });
    if (!wilayah) throw new NotFoundException(`Wilayah with ID ${id_wilayah} not found`);
    return wilayah;
  }

  async createWilayah(data: CreateWilayahDto): Promise<Wilayah> {
    if (data.id_group) {
      await this.validateGroupWilayah(data.id_group);
    }
    return this.prisma.wilayah.create({ data });
  }

  async updateWilayah(id_wilayah: number, data: UpdateWilayahDto): Promise<Wilayah> {
    await this.getWilayahById(id_wilayah); // Ensure wilayah exists
    if (data.id_group) {
      await this.validateGroupWilayah(data.id_group);
    }
    return this.prisma.wilayah.update({
      where: { id_wilayah },
      data: { ...data, updated_at: new Date() },
    });
  }

  async deleteWilayah(id_wilayah: number): Promise<Wilayah> {
    await this.getWilayahById(id_wilayah); // Ensure wilayah exists
    return this.prisma.wilayah.update({
      where: { id_wilayah },
      data: { deleted_at: new Date() },
    });
  }

  private async validateGroupWilayah(id_group: number): Promise<void> {
    const groupWilayah = await this.prisma.group_Wilayah.findUnique({
      where: { id_group },
    });
    if (!groupWilayah) {
      throw new BadRequestException(`Group Wilayah with ID ${id_group} does not exist`);
    }
  }
}
