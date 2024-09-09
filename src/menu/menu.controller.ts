import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
  } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto, UpdateMenuDto } from './dtos/menu.dto';
  
  @Controller('api')
  export class MenuController {
    constructor(
      private readonly menuService: MenuService,
    ) {}
  
    @Get('menu')
    async getAllMenu() {
      const data = await this.menuService.getAllMenu();
      return {
        message: 'Data Menu',
        ...data,
      };
    }
  
    @Get('menu/:id')
    async getMenuById(@Param('id', ParseIntPipe) id: number) {
      const MenuFound =
        await this.menuService.getMenuById(
          Number(id),
        );
      if (!MenuFound)
        throw new BadRequestException('Menu does not exist');
      return MenuFound;
    }
  
    @Post('menu/create')
    async createTask(@Body() data: CreateMenuDto) {
      const create =
        await this.menuService.createMenu(data);
      return {
        message: 'succes create Menu',
        ...create,
      };
    }
  
    @Put('menu/update/:id')
    async updateMenu(
      @Param('id') id: number,
      @Body() data: UpdateMenuDto,
    ) {
      try {
        const update =
          await this.menuService.updateMenu(
            Number(id),
            data,
          );
        return {
          message: 'success update',
          ...update,
        };
      } catch (error) {
        throw new BadRequestException('Menu does not exist');
      }
    }
  
    @Delete('menu/delete/:id')
    async deleteMenu(@Param('id', ParseIntPipe) id: number) {
      try {
        const deletes =
          await this.menuService.deleteMenu(
            Number(id),
          );
        return {
          message: 'Success Delete',
          ...deletes,
        };
      } catch (error) {
        throw new BadRequestException('Menu does not exist');
      }
    }
  }
  