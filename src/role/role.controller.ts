
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
  Req,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleWithAccessDto } from './dtos/role.dto';
import { AuditService } from '../audit/audit.service';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { User } from '../decorators/curentuser.decorator';

@Controller('api')
@UseGuards(JwtAuthGuard)
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly auditService: AuditService,
  ) {}

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
    @Req() request: Request,
    @User() user: any,
  ) {
    const { role, selectedActions, selectedMenus } = body;

    try {
      const createdRole = await this.roleService.createRoleWithActions(
        role,
        selectedActions,
        selectedMenus,
      );

      await this.auditService.create({
        Url: "/api/role/create",
        ActionName: "create role",
        MenuName: "role management",
        DataBefore: "",
        DataAfter: JSON.stringify(createdRole),
        UserName: user.username,
        IpAddress: request.ip || 'Unknown',
        ActivityDate: new Date(),
        Browser: this.getBrowserFromUserAgent(request.headers['user-agent'] || 'Unknown'),
        OS: this.getOSFromUserAgent(request.headers['user-agent'] || 'Unknown', request),
        AppSource: "Desktop",
        created_by: 1,
        updated_by: 1,
      });

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
    @Req() request: Request,
    @User() user: any,
  ) {
    try {
      const oldRole = await this.roleService.getRoleById(id);
      const updatedRole = await this.roleService.updateRoleWithAccess(id, updateData);

      await this.auditService.create({
        Url: `/api/role/update/${id}`,
        ActionName: "update role",
        MenuName: "role management",
        DataBefore: JSON.stringify(oldRole),
        DataAfter: JSON.stringify(updatedRole),
        UserName: user.username,
        IpAddress: request.ip || 'Unknown',
        ActivityDate: new Date(),
        Browser: this.getBrowserFromUserAgent(request.headers['user-agent'] || 'Unknown'),
        OS: this.getOSFromUserAgent(request.headers['user-agent'] || 'Unknown', request),
        AppSource: "Desktop",
        created_by: 1,
        updated_by: 1,
      });

      return {
        message: 'Role updated successfully',
        data: updatedRole,
      };
    } catch (error) {
      console.error('Error updating role:', error);
      throw new BadRequestException('Failed to update Role, RoleActions, and MenuRoles');
    }
  }

  @Delete('role/delete/:id')
  async deleteRole(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
    @User() user: any,
  ) {
    try {
      const roleToDelete = await this.roleService.getRoleById(id);
      const deletes = await this.roleService.deleteRole(Number(id));

      await this.auditService.create({
        Url: `/api/role/delete/${id}`,
        ActionName: "delete role",
        MenuName: "role management",
        DataBefore: JSON.stringify(roleToDelete),
        DataAfter: "",
        UserName: user.username,
        IpAddress: request.ip || 'Unknown',
        ActivityDate: new Date(),
        Browser: this.getBrowserFromUserAgent(request.headers['user-agent'] || 'Unknown'),
        OS: this.getOSFromUserAgent(request.headers['user-agent'] || 'Unknown', request),
        AppSource: "Desktop",
        created_by: 1,
        updated_by: 1,
      });

      return {
        message: 'Success Delete',
        ...deletes,
      };
    } catch (error) {
      throw new BadRequestException('Role does not exist');
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

  private getBrowserFromUserAgent(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    return 'Unknown';
  }

  private getOSFromUserAgent(userAgent: string, request: Request): string {  
    const testOS = request.headers['x-test-os'];  
    if (/PostmanRuntime/i.test(userAgent)) return 'Postman (Testing Environment)';  
    if (testOS) return testOS as string;      
    if (userAgent.includes('Win')) return 'Windows';
    if (userAgent.includes('Mac')) return 'MacOS';
    if (userAgent.includes('Linux')) return 'Linux';
    return 'Unknown';
  }
  
}
