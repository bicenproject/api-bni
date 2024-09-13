import { Menu_Role, Role, Role_Action } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto, UpdateRoleWithAccessDto } from './dtos/role.dto';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async getAllRole(): Promise<Role[]> {
    return this.prisma.role.findMany();
  }

  async getRoleById(id_role: number): Promise<Role> {  
    const role = await this.prisma.role.findUnique({  
      where: { id_role },  
    });  
    if (!role) throw new NotFoundException(`Role with ID ${id_role} not found`);  
    return role;  
  }  
  
  async createRoleWithActions(  
    roleData: CreateRoleDto,  
    selectedActions: number[],  
    selectedMenus: number[]  
  ): Promise<Role & { Role_Action: Role_Action[]; Menu_Role: Menu_Role[] }> {  
    if (!Array.isArray(selectedActions) || !selectedActions.every(Number.isInteger)) {  
      throw new BadRequestException('SelectedActions must be an array of integers.');  
    }  
    if (!Array.isArray(selectedMenus) || !selectedMenus.every(Number.isInteger)) {  
      throw new BadRequestException('SelectedMenus must be an array of integers.');  
    }  

    return this.prisma.$transaction(async (prisma) => {  
      // Validate that all selectedActions exist  
      const existingActions = await prisma.menu_Action.findMany({  
        where: { id_menu_action: { in: selectedActions } },  
        select: { id_menu_action: true },  
      });  
      if (existingActions.length !== selectedActions.length) {  
        throw new BadRequestException('One or more selected actions do not exist.');  
      }  

      // Validate that all selectedMenus exist  
      const existingMenus = await prisma.menu.findMany({  
        where: { id_menu: { in: selectedMenus } },  
        select: { id_menu: true },  
      });  
      if (existingMenus.length !== selectedMenus.length) {  
        throw new BadRequestException('One or more selected menus do not exist.');  
      }  

      // Create the new role with associated actions and menus  
      const role = await prisma.role.create({  
        data: {  
          ...roleData,  
          Role_Action: {  
            create: selectedActions.map((actionId) => ({  
              id_menu_action: actionId,  
            })),  
          },  
          Menu_Role: {  
            create: selectedMenus.map((menuId) => ({  
              id_menu: menuId,  
            })),  
          },  
        },  
        include: {  
          Role_Action: true,  
          Menu_Role: true,  
        },  
      });  

      return role;  
    });  
  }  

  async updateRoleWithAccess(  
    id_role: number,  
    updateData: UpdateRoleWithAccessDto  
  ) {  
    const { role, selectedMenus, selectedActions } = updateData;  

    return this.prisma.$transaction(async (prisma) => {  
      // Update the role  
    const updatedRole = await prisma.role.update({  
        where: { id_role },  
        data: {  
          name: role.name,  
          type: role.type,  
          description: role.description,  
        },  
      });  

      // Delete existing Role_Action entries  
      await prisma.role_Action.deleteMany({  
        where: { id_role },  
      });  

      // Create new Role_Action entries  
      if (selectedActions.length > 0) {  
        await prisma.role_Action.createMany({  
          data: selectedActions.map((actionId) => ({  
            id_role,  
            id_menu_action: actionId,  
          })),  
        });  
      }  

      // Delete existing Menu_Role entries  
      await prisma.menu_Role.deleteMany({  
        where: { id_role },  
      });  

      // Create new Menu_Role entries  
      if (selectedMenus.length > 0) {  
        await prisma.menu_Role.createMany({  
          data: selectedMenus.map((menuId) => ({  
            id_role,  
            id_menu: menuId,  
          })),  
        });  
      }  

      return updatedRole;  
    });  
  }  

  async getAccessRights(id_role: number) {  
    const role = await this.prisma.role.findUnique({  
      where: { id_role },  
    });  

    if (!role) {  
      throw new NotFoundException(`Role with ID ${id_role} not found`);  
    }  

    const menuRoles = await this.prisma.menu_Role.findMany({  
      where: { id_role },  
      include: {  
        menu: true,  
      },  
    });  

    const roleActions = await this.prisma.role_Action.findMany({  
      where: { id_role },  
      include: {  
        menu_action: true,  
      },  
    });  

    const webAccess = menuRoles  
      .filter((mr) => mr.menu?.platform === 'Web')  
      .map((mr) => mr.id_menu);  

    const mobileAccess = menuRoles  
      .filter((mr) => mr.menu?.platform === 'Mobile')  
      .map((mr) => mr.id_menu);  

    const selectedActions = roleActions.map((ra) => ra.id_menu_action);  

    return {  
      webAccess,  
      mobileAccess,  
      selectedActions,  
    };  
  }  

  async updateAccessRights(id_role: number, accessRights: {  
    webAccess: number[],  
    mobileAccess: number[],  
    selectedActions: number[]  
  }) {  
    const role = await this.getRoleById(id_role);  

    // Update Menu_Role  
    await this.prisma.menu_Role.deleteMany({ where: { id_role } });  
    const menuRoles = [  
      ...accessRights.webAccess.map(id_menu => ({ id_role, id_menu })),  
      ...accessRights.mobileAccess.map(id_menu => ({ id_role, id_menu }))  
    ];  
    await this.prisma.menu_Role.createMany({ data: menuRoles });  

    // Update Role_Action  
    await this.prisma.role_Action.deleteMany({ where: { id_role } });  
    const roleActions = accessRights.selectedActions.map(id_menu_action => ({  
      id_role,  
      id_menu_action  
    }));  
    await this.prisma.role_Action.createMany({ data: roleActions });  

    return { message: 'Access rights updated successfully' };  
  }  

  async deleteRole(id_role: number): Promise<Role> {
    return this.prisma.role.delete({
      where: {
        id_role: id_role,
      },
    });
  }
}
