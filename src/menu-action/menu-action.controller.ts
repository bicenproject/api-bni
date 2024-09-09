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
import { MenuActionService } from './menu-action.service';
import { CreateMenuActionDto, UpdateMenuActionDto } from './dtos/menu-action.dto';

  
  @Controller('api')
  export class MenuActionController {
    constructor(private readonly menuActionService: MenuActionService) {}
  
    @Get('MenuAction')
    async getAllMenuAction() {
      const data = await this.menuActionService.getAllMenuAction();
      if (!data) throw new BadRequestException('MenuAction does not exist');
      return {
        message: 'Data MenuAction',
        ...data,
      };
    }
  
    @Get('MenuAction/:id')
    async getMenuActionById(@Param('id', ParseIntPipe) id: number) {
      const MenuActionFound = await this.menuActionService.getMenuActionById(
        Number(id),
      );
      if (!MenuActionFound)
        throw new BadRequestException('MenuAction does not exist');
      return MenuActionFound;
    }
  
    @Post('MenuAction/create')
    async createTask(@Body() data: CreateMenuActionDto) {
      const create = await this.menuActionService.createMenuAction(data);
      return {
        message: 'succes create MenuAction',
        ...create,
      };
    }
  
    @Put('MenuAction/update/:id')
    async updateMenuAction(
      @Param('id', ParseIntPipe) id: number,
      @Body() data: UpdateMenuActionDto,
    ) {
      try {
        const update = await this.menuActionService.updateMenuAction(Number(id), data);
        return {
          message: 'success update',
          ...update,
        };
      } catch (error) {
        throw new BadRequestException('MenuAction does not exist');
      }
    }
  
    @Delete('MenuAction/delete/:id')
    async deleteMenuAction(@Param('id', ParseIntPipe) id: number) {
      try {
        const deletes = await this.menuActionService.deleteMenuAction(Number(id));
        return {
          message: 'Success Delete',
          ...deletes,
        };
      } catch (error) {
        throw new BadRequestException('MenuAction does not exist');
      }
    }
  }
  