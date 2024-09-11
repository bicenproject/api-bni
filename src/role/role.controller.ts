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
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto, UpdateRoleWithAccessDto } from './dtos/role.dto';
import { CreateRoleActionDto } from 'src/role-action/dtos/roleAction.dto';

@Controller('api')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('role')
  async getAllRole() {
    const data = await this.roleService.getAllRole();
    return {
      message: 'Data Role',
      data,
    };
  }

  @Get('role/:id')  
  async getRoleById(@Param('id', ParseIntPipe) id: number) {  
    const role = await this.roleService.getRoleById(id);  
    return {  
      message: 'Role retrieved successfully',  
      data: role,  
    };  
  }  
  @Post('role/create')
  async createRole(
    @Body()
    body: {
      role: CreateRoleDto;
      selectedActions: number[];
      selectedMenus: number[];
    },
  ) {
    const { role, selectedActions, selectedMenus } = body;

    console.log('Received body:', body);
    try {
      const createdRole = await this.roleService.createRoleWithActions(
        role,
        selectedActions,
        selectedMenus,
      );
      return {
        message: 'Successfully created Role, RoleActions, and MenuRoles',
        role: createdRole,
      };
    } catch (error) {
      console.error('Error creating role:', error);
      throw new BadRequestException(
        'Failed to create Role, RoleActions, and MenuRoles',
      );
    }
  }

  @Put('role/update/:id')  
  async updateRole(  
    @Param('id', ParseIntPipe) id: number,  
    @Body() updateData: UpdateRoleWithAccessDto,  
  ) {  
    try {  
      const updatedRole = await this.roleService.updateRoleWithAccess(id, updateData);  
      return {  
        message: 'Role updated successfully',  
        data: updatedRole,  
      };  
    } catch (error) {  
      console.error('Error updating role:', error);  
      throw new BadRequestException('Failed to update Role, RoleActions, and MenuRoles');  
    }  
  }  

  @Get('role/:id/access-rights')  
  async getAccessRights(@Param('id', ParseIntPipe) id: number) {  
    const accessRights = await this.roleService.getAccessRights(id);  
    return {  
      message: 'Access rights retrieved successfully',  
      data: accessRights,  
    };  
  }  

  @Put(':id/access-rights')  
  async updateAccessRights(  
    @Param('id', ParseIntPipe) id: number,  
    @Body() accessRights: {  
      webAccess: number[],  
      mobileAccess: number[],  
      selectedActions: number[]  
    },  
  ) {  
    const result = await this.roleService.updateAccessRights(id, accessRights);  
    return {  
      message: 'Access rights updated successfully',  
      data: result,  
    };  
  }  

  @Delete('role/delete/:id')
  async deleteRole(@Param('id', ParseIntPipe) id: number) {
    try {
      const deletes = await this.roleService.deleteRole(Number(id));
      return {
        message: 'Success Delete',
        ...deletes,
      };
    } catch (error) {
      throw new BadRequestException('Role does not exist');
    }
  }
}