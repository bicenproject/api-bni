import { Menu} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateMenuDto, UpdateMenuDto } from './dtos/menu.dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async getAllMenu(): Promise<Menu[]> {
    return this.prisma.menu.findMany();
  }
  
  async getAllMenuWithActions(): Promise<any> {
    const menus = await this.prisma.menu.findMany();

    const menuActions = await this.prisma.menu_Action.findMany();

    const menusWithActions = menus.map(menu => ({
      ...menu,
      actions: menuActions.filter(action => action.id_menu === menu.id_menu)
    }));

    return menusWithActions;
  }

  async getMenuById(id_menu: number): Promise<Menu> {
    return this.prisma.menu.findUnique({
      where: {
        id_menu: id_menu,
      },
    });
  }

  async createMenu(data: CreateMenuDto): Promise<Menu> {
    return this.prisma.menu.create({
      data,
    });
  }

  async updateMenu(id_menu: number, data: UpdateMenuDto): Promise<Menu> {
    return this.prisma.menu.update({
      where: {
        id_menu: id_menu,
      },
      data,
    });
  }

  async deleteMenu(id_menu: number): Promise<Menu> {
    return this.prisma.menu.delete({
      where: {
        id_menu: id_menu,
      },
    });
  }
}