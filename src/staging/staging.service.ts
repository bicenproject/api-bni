
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Staging } from '@prisma/client';
import { CreateStagingDto } from './dtos/createStaging.dto';
import { UpdateStagingDto } from './dtos/updateStaging.dto';
@Injectable()
export class StagingService {
  constructor(private prisma: PrismaService) {}

  async getAllStaging(): Promise<Staging[]> {
    return this.prisma.staging.findMany();
  }

  async getStagingById(id_staging: number): Promise<Staging> {
    const staging = await this.prisma.staging.findUnique({
      where: { id_staging },
    });
    if (!staging) throw new NotFoundException(`Staging with ID ${id_staging} not found`);
    return staging;
  }

  async createStaging(data: CreateStagingDto): Promise<Staging> {
    try {
      const createdStaging = await this.prisma.staging.create({
        data: {
          name: data.name,
          staging: data.staging,
          description: data.description,
          created_by: data.created_by,
          updated_by: data.updated_by,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
      return createdStaging;
    } catch (error) {
      throw new BadRequestException(`Failed to create staging: ${error.message}`);
    }
  }

  async updateStaging(id_staging: number, data: UpdateStagingDto): Promise<Staging> {
    await this.getStagingById(id_staging); // Ensure staging exists
    return this.prisma.staging.update({
      where: { id_staging },
      data: {
        name: data.name,
        staging: data.staging,
        description: data.description,
        updated_by: data.updated_by,
        updated_at: new Date(),
      },
    });
  }

  async deleteStaging(id_staging: number): Promise<Staging> {
    await this.getStagingById(id_staging); // Ensure staging exists
    return this.prisma.staging.delete({
      where: { id_staging },
    });
  }
}
