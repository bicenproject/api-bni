
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
  import { MenuRoleService } from './menu-role.service';
import { CreateMenuRoleDto, UpdateMenuRoleDto } from './dtos/menu-role.dto';
  
  @Controller('api')
  export class MenuRoleController {
    constructor(private readonly menuRoleService: MenuRoleService) {}
  
    @Get('MenuRole')
    async getAllMenuRoles() {
      const data = await this.menuRoleService.getAllMenuRoles();
      if (!data) throw new BadRequestException('MenuRole does not exist');
      return {
        message: 'Data MenuRole',
        data,
      };
    }
  
    @Get('MenuRole/:id')
    async getMenuRoleById(@Param('id', ParseIntPipe) id: number) {
      const menuRoleFound = await this.menuRoleService.getMenuRoleById(Number(id));
      if (!menuRoleFound)
        throw new BadRequestException('MenuRole does not exist');
      return menuRoleFound;
    }
  
    @Post('MenuRole/create')
    async createMenuRole(@Body() data: CreateMenuRoleDto) {
      const create = await this.menuRoleService.createMenuRole(data);
      return {
        message: 'success create MenuRole',
        data: create,
      };
    }
  
    @Put('MenuRole/update/:id')
    async updateMenuRole(
      @Param('id', ParseIntPipe) id: number,
      @Body() data: UpdateMenuRoleDto,
    ) {
      try {
        const update = await this.menuRoleService.updateMenuRole(Number(id), data);
        return {
          message: 'success update',
          data: update,
        };
      } catch (error) {
        throw new BadRequestException('MenuRole does not exist');
      }
    }
  
    @Delete('MenuRole/delete/:id')
    async deleteMenuRole(@Param('id', ParseIntPipe) id: number) {
      try {
        const deleted = await this.menuRoleService.deleteMenuRole(Number(id));
        return {
          message: 'Success Delete',
          data: deleted,
        };
      } catch (error) {
        throw new BadRequestException('MenuRole does not exist');
      }
    }
  }
  