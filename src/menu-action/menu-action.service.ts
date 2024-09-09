import {
    Injectable,
    NotFoundException,
    BadRequestException,
  } from '@nestjs/common';
  import { PrismaService } from '../prisma/prisma.service';
import { Menu_Action } from '@prisma/client';
import { CreateMenuActionDto, UpdateMenuActionDto } from './dtos/menu-action.dto';

  @Injectable()
  export class MenuActionService {
    constructor(private prisma: PrismaService) {}
  
    async getAllMenuAction(): Promise<Menu_Action[]> {
      return this.prisma.menu_Action.findMany({});
    }
  
    async getMenuActionById(id_menu_action: number): Promise<Menu_Action> {
      const Role = await this.prisma.menu_Action.findUnique({
        where: { id_menu_action },
      });
      if (!Role)
        throw new NotFoundException(`Menu-Action with ID ${id_menu_action} not found`);
      return Role;
    }
  
    async createMenuAction(data: CreateMenuActionDto): Promise<Menu_Action> {
      if (data.id_menu) {
        await this.validateIdMenu(data.id_menu);
      }
      return this.prisma.menu_Action.create({ data });
    }
  
    async updateMenuAction(
      id_menu_action: number,
      data: UpdateMenuActionDto,
    ): Promise<Menu_Action> {
      await this.getMenuActionById(id_menu_action); 
      if (data.id_menu) {
        await this.validateIdMenu(data.id_menu);
      }
      return this.prisma.menu_Action.update({
        where: { id_menu_action },
        data: { ...data },
      });
    }
  
    async deleteMenuAction(id_menu_action: number): Promise<Menu_Action> {
      await this.getMenuActionById(id_menu_action);
      return this.prisma.menu_Action.delete({
        where: { id_menu_action: id_menu_action },
      });
    }
  
    private async validateIdMenu(id_menu: number): Promise<void> {
      const groupRole = await this.prisma.menu_Action.findUnique({
        where: { id_menu },
      });
      if (!groupRole) {
        throw new BadRequestException(
          `Id Menu with ID ${id_menu} does not exist`,
        );
      }
    }
  }
  