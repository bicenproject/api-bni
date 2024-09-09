import { Group_Wilayah} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateGroupWilayahDto, UpdateGroupWilayahDto } from './dtos/group.dto';

@Injectable()
export class GroupWilayahService {
  constructor(private prisma: PrismaService) {}

  async getAllGroup_Wilayah(): Promise<Group_Wilayah[]> {
    return this.prisma.group_Wilayah.findMany();
  }

  async getGroup_WilayahByid_group(id_group: number): Promise<Group_Wilayah> {
    return this.prisma.group_Wilayah.findUnique({
      where: {
        id_group: id_group,
      },
    });
  }

  async createGroup_Wilayah(data: CreateGroupWilayahDto): Promise<Group_Wilayah> {
    return this.prisma.group_Wilayah.create({
      data,
    });
  }

  async updateGroup_Wilayah(id_group: number, data: UpdateGroupWilayahDto): Promise<Group_Wilayah> {
    return this.prisma.group_Wilayah.update({
      where: {
        id_group: id_group,
      },
      data,
    });
  }

  async deleteGroup_Wilayah(id_group: number): Promise<Group_Wilayah> {
    return this.prisma.group_Wilayah.delete({
      where: {
        id_group: id_group,
      },
    });
  }
}