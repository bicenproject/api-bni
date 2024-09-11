
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Menu_Action, Prisma } from '@prisma/client';
import { CreateMenuActionDto, UpdateMenuActionDto } from './dtos/menu-action.dto';

@Injectable()
export class MenuActionService {
  constructor(private prisma: PrismaService) {}

  async getAllMenuAction(): Promise<Menu_Action[]> {
    return this.prisma.menu_Action.findMany({});
  }

  async getMenuActionById(id_menu_action: number): Promise<Menu_Action> {
    const menuAction = await this.prisma.menu_Action.findUnique({
      where: { id_menu_action },
    });
    if (!menuAction)
      throw new NotFoundException(`Menu-Action with ID ${id_menu_action} not found`);
    return menuAction;
  }

  async createMenuAction(data: CreateMenuActionDto): Promise<Menu_Action> {
    if (data.id_menu) {
      await this.validateIdMenu(data.id_menu);
    }
    return this.prisma.menu_Action.create({
      data: {
        ...data,
        isActive: data.isActive ? true : false,
      },
    });
  }

  async updateMenuAction(
    id_menu_action: number,
    data: UpdateMenuActionDto,
  ): Promise<Menu_Action> {
    await this.getMenuActionById(id_menu_action); 
    if (data.id_menu) {
      await this.validateIdMenu(data.id_menu);
    }
    const updateData: Prisma.Menu_ActionUpdateInput = {
      ...data,
      isActive: data.isActive !== undefined ? (data.isActive ? true : false) : undefined,
    };
    return this.prisma.menu_Action.update({
      where: { id_menu_action },
      data: updateData,
    });
  }

  async deleteMenuAction(id_menu_action: number): Promise<Menu_Action> {
    await this.getMenuActionById(id_menu_action);
    return this.prisma.menu_Action.delete({
      where: { id_menu_action },
    });
  }

  private async validateIdMenu(id_menu: number): Promise<void> {
    const menu = await this.prisma.menu.findUnique({
      where: { id_menu },
    });
    if (!menu) {
      throw new BadRequestException(
        `Menu with ID ${id_menu} does not exist`,
      );
    }
  }
}
