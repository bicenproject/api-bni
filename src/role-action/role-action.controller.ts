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
import { RoleActionService } from './role-action.service';
import { Role_Action } from '@prisma/client';
import {
  CreateRoleActionDto,
  UpdateRoleActionDto,
} from './dtos/roleAction.dto';

@Controller('api')
export class RoleActionController {
  constructor(private readonly roleService: RoleActionService) {}

  @Get('RoleAction')
  async getAllRoleAction() {
    const data = await this.roleService.getAllRoleAction();
    if (!data) throw new BadRequestException('RoleAction does not exist');
    return {
      message: 'Data RoleAction',
      ...data,
    };
  }

  @Get('RoleAction/:id')
  async getRoleActionById(@Param('id', ParseIntPipe) id: number) {
    const RoleActionFound = await this.roleService.getRoleActionById(
      Number(id),
    );
    if (!RoleActionFound)
      throw new BadRequestException('RoleAction does not exist');
    return RoleActionFound;
  }

  @Post('RoleAction/create')
  async createTask(@Body() data: CreateRoleActionDto) {
    const create = await this.roleService.createRoleAction(data);
    return {
      message: 'succes create RoleAction',
      ...create,
    };
  }

  @Put('RoleAction/update/:id')
  async updateRoleAction(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateRoleActionDto,
  ) {
    try {
      const update = await this.roleService.updateRoleAction(Number(id), data);
      return {
        message: 'success update',
        ...update,
      };
    } catch (error) {
      throw new BadRequestException('RoleAction does not exist');
    }
  }

  @Delete('RoleAction/delete/:id')
  async deleteRoleAction(@Param('id', ParseIntPipe) id: number) {
    try {
      const deletes = await this.roleService.deleteRoleAction(Number(id));
      return {
        message: 'Success Delete',
        ...deletes,
      };
    } catch (error) {
      throw new BadRequestException('RoleAction does not exist');
    }
  }
}
