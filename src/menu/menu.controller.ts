
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
import { Request } from 'express';
import { MenuService } from './menu.service';
import { CreateMenuDto, UpdateMenuDto } from './dtos/menu.dto';
import { AuditService } from '../audit/audit.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { User } from '../decorators/curentuser.decorator';

@Controller('api')
@UseGuards(JwtAuthGuard)
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly auditService: AuditService,
  ) {}

  @Get('menu')
  async getAllMenu() {
    const data = await this.menuService.getAllMenu();
    return {
      message: 'Data Menu',
      ...data,
    };
  }

  @Get('menu-with-actions')
  async getAllMenuWithActions() {
    const data = await this.menuService.getAllMenuWithActions();
    return {
      message: 'Data Menu with Actions',
      data,
    };
  }

  @Get('menu/:id')
  async getMenuById(@Param('id', ParseIntPipe) id: number) {
    const MenuFound = await this.menuService.getMenuById(Number(id));
    if (!MenuFound) throw new BadRequestException('Menu does not exist');
    return MenuFound;
  }

  @Post('menu/create')
  async createMenu(
    @Body() data: CreateMenuDto,
    @Req() req: Request,
    @User() user: any
  ) {
    console.log('Received data:', data);
    const create = await this.menuService.createMenu(data);
    
    // Audit log
    await this.auditService.create({
      Url: req.url,
      ActionName: "Create Menu",
      MenuName: "Menu Management",
      DataBefore: "",
      DataAfter: JSON.stringify(create),
      UserName: user.username,
      IpAddress: req.ip,
      ActivityDate: new Date(),
      Browser: req.headers['user-agent'] || 'Unknown',
      OS: this.getOSFromUserAgent(req.headers['user-agent'] || '', req),
      AppSource: "Desktop",
      created_by: user.userId,
      updated_by: user.userId,
    });

    return {
      message: 'success create Menu',
      ...create,
    };
  }

  @Put('menu/update/:id')
  async updateMenu(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateMenuDto,
    @Req() req: Request,
    @User() user: any
  ) {
    try {
      const oldData = await this.menuService.getMenuById(Number(id));
      const update = await this.menuService.updateMenu(Number(id), data);
      
      // Audit log
      await this.auditService.create({
        Url: req.url,
        ActionName: "Update Menu",
        MenuName: "Menu Management",
        DataBefore: JSON.stringify(oldData),
        DataAfter: JSON.stringify(update),
        UserName: user.username,
        IpAddress: req.ip,
        ActivityDate: new Date(),
        Browser: req.headers['user-agent'] || 'Unknown',
        OS: this.getOSFromUserAgent(req.headers['user-agent'] || '', req),
        AppSource: "Desktop",
        created_by: user.userId,
        updated_by: user.userId,
      });

      return {
        message: 'success update',
        ...update,
      };
    } catch (error) {
      throw new BadRequestException('Menu does not exist');
    }
  }

  @Delete('menu/delete/:id')
  async deleteMenu(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @User() user: any
  ) {
    try {
      const oldData = await this.menuService.getMenuById(Number(id));
      const deletes = await this.menuService.deleteMenu(Number(id));
      
      // Audit log
      await this.auditService.create({
        Url: req.url,
        ActionName: "Delete Menu",
        MenuName: "Menu Management",
        DataBefore: JSON.stringify(oldData),
        DataAfter: "",
        UserName: user.username,
        IpAddress: req.ip,
        ActivityDate: new Date(),
        Browser: req.headers['user-agent'] || 'Unknown',
        OS: this.getOSFromUserAgent(req.headers['user-agent'] || '', req),
        AppSource: "Desktop",
        created_by: user.userId,
        updated_by: user.userId,
      });

      return {
        message: 'Success Delete',
        ...deletes,
      };
    } catch (error) {
      throw new BadRequestException('Menu does not exist');
    }
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
