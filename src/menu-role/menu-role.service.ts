
import {
    Injectable,
    NotFoundException,
    BadRequestException,
  } from '@nestjs/common';
  import { PrismaService } from '../prisma/prisma.service';
  import { Menu_Role } from '@prisma/client';
import { CreateMenuRoleDto, UpdateMenuRoleDto } from './dtos/menu-role.dto';
  
  @Injectable()
  export class MenuRoleService {
    constructor(private prisma: PrismaService) {}
  
    async getAllMenuRoles(): Promise<Menu_Role[]> {
      return this.prisma.menu_Role.findMany({});
    }
  
    async getMenuRoleById(id_menu_role: number): Promise<Menu_Role> {
      const menuRole = await this.prisma.menu_Role.findUnique({
        where: { id_menu_role },
      });
      if (!menuRole)
        throw new NotFoundException(`Menu Role with ID ${id_menu_role} not found`);
      return menuRole;
    }
  
    async createMenuRole(data: CreateMenuRoleDto): Promise<Menu_Role> {
      await this.validateMenuAndRole(data.id_menu, data.id_role);
      return this.prisma.menu_Role.create({ data });
    }
  
    async updateMenuRole(
      id_menu_role: number,
      data: UpdateMenuRoleDto,
    ): Promise<Menu_Role> {
      await this.getMenuRoleById(id_menu_role); // Ensure menu role exists
      if (data.id_menu || data.id_role) {
        await this.validateMenuAndRole(data.id_menu, data.id_role);
      }
      return this.prisma.menu_Role.update({
        where: { id_menu_role },
        data: { ...data },
      });
    }
  
    async deleteMenuRole(id_menu_role: number): Promise<Menu_Role> {
      await this.getMenuRoleById(id_menu_role); // Ensure menu role exists
      return this.prisma.menu_Role.delete({
        where: { id_menu_role },
      });
    }
  
    private async validateMenuAndRole(id_menu: number, id_role: number): Promise<void> {
      const menu = await this.prisma.menu.findUnique({
        where: { id_menu },
      });
      if (!menu) {
        throw new BadRequestException(`Menu with ID ${id_menu} does not exist`);
      }
  
      const role = await this.prisma.role.findUnique({
        where: { id_role },
      });
      if (!role) {
        throw new BadRequestException(`Role with ID ${id_role} does not exist`);
      }
    }
  }
  