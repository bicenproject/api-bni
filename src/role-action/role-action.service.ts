import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, Role_Action } from '@prisma/client';
import {
  CreateRoleActionDto,
  UpdateRoleActionDto,
} from './dtos/roleAction.dto';
@Injectable()
export class RoleActionService {
  constructor(private prisma: PrismaService) {}

  async getAllRoleAction(): Promise<Role_Action[]> {
    return this.prisma.role_Action.findMany({});
  }

  async getRoleActionById(id_role_action: number): Promise<Role_Action> {
    const Role = await this.prisma.role_Action.findUnique({
      where: { id_role_action },
    });
    if (!Role)
      throw new NotFoundException(`Role with ID ${id_role_action} not found`);
    return Role;
  }

  async createRoleAction(data: CreateRoleActionDto): Promise<Role_Action> {
    if (data.id_menu_action) {
      await this.validateGroupRole(data.id_menu_action);
    }
    return this.prisma.role_Action.create({ data });
  }

  async updateRoleAction(
    id_role_action: number,
    data: UpdateRoleActionDto,
  ): Promise<Role_Action> {
    await this.getRoleActionById(id_role_action); 
    if (data.id_menu_action) {
      await this.validateGroupRole(data.id_menu_action);
    }
    return this.prisma.role_Action.update({
      where: { id_role_action },
      data: { ...data },
    });
  }

  async deleteRoleAction(id_role_action: number): Promise<Role_Action> {
    await this.getRoleActionById(id_role_action);
    return this.prisma.role_Action.delete({
      where: { id_role_action: id_role_action },
    });
  }

  private async validateGroupRole(id_menu_action: number): Promise<void> {
    const groupRole = await this.prisma.role_Action.findFirst({
      where: { id_menu_action },
    });
    if (!groupRole) {
      throw new BadRequestException(
        `Group Role with ID ${id_menu_action} does not exist`,
      );
    }
  }
}
