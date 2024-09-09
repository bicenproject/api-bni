import { Role} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from './dtos/role.dto';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async getAllRole(): Promise<Role[]> {
    return this.prisma.role.findMany();
  }

  async getRoleByid_role(id_role: number): Promise<Role> {
    return this.prisma.role.findUnique({
      where: {
        id_role: id_role,
      },
    });
  }

  async createRole(data: CreateRoleDto): Promise<Role> {
    return this.prisma.role.create({
      data,
    });
  }

  async updateRole(id_role: number, data: UpdateRoleDto): Promise<Role> {
    return this.prisma.role.update({
      where: {
        id_role: id_role,
      },
      data,
    });
  }

  async deleteRole(id_role: number): Promise<Role> {
    return this.prisma.role.delete({
      where: {
        id_role: id_role,
      },
    });
  }
}