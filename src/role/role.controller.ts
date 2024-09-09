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
import { Role } from '@prisma/client';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto } from './dtos/role.dto';

@Controller('api')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
  ) {}

  @Get('role')
  async getAllRole() {
    const data = await this.roleService.getAllRole();
    return {
      message: 'Data Role',
      ...data,
    };
  }

  @Get('role/:id')
  async getRoleById(@Param('id', ParseIntPipe) id: number) {
    const RoleFound =
      await this.roleService.getRoleByid_role(
        Number(id),
      );
    if (!RoleFound)
      throw new BadRequestException('Role does not exist');
    return RoleFound;
  }

  @Post('role/create')
  async createTask(@Body() data: CreateRoleDto) {
    const create =
      await this.roleService.createRole(data);
    return {
      message: 'succes create Role',
      ...create,
    };
  }

  @Put('role/update/:id')
  async updateRole(
    @Param('id') id: number,
    @Body() data: UpdateRoleDto,
  ) {
    try {
      const update =
        await this.roleService.updateRole(
          Number(id),
          data,
        );
      return {
        message: 'success update',
        ...update,
      };
    } catch (error) {
      throw new BadRequestException('Role does not exist');
    }
  }

  @Delete('role/delete/:id')
  async deleteRole(@Param('id', ParseIntPipe) id: number) {
    try {
      const deletes =
        await this.roleService.deleteRole(
          Number(id),
        );
      return {
        message: 'Success Delete',
        ...deletes,
      };
    } catch (error) {
      throw new BadRequestException('Role does not exist');
    }
  }
}
