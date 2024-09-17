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
  import { InventoryService } from './inventory.service';  
  import { CreateInventoryEDCDto } from './dtos/CreateInventoryDto'; // Adjust the path as necessary  
  import { UpdateInventoryEDCDto } from './dtos/UpdateInventoryDto'; // Adjust the path as necessary  
  import { AuditService } from '../audit/audit.service'; // Adjust the path as necessary  
  import { JwtAuthGuard } from '../auth/guards/auth.guard'; // Adjust the path as necessary  
  import { User } from '../decorators/curentuser.decorator'; // Adjust the path as necessary  
  
  @Controller('inventory')  
  export class InventoryController {  
    constructor(  
      private readonly inventoryService: InventoryService,  
      private readonly auditService: AuditService,  
    ) {}  
  
    @Get()  
    async getAllInventory() {  
      const data = await this.inventoryService.getAllInventory();  
      return {  
        message: 'Data Inventory',  
        data,  
      };  
    }  
  
    @Get(':id')  
    async getInventoryById(@Param('id', ParseIntPipe) id: number) {  
      const inventoryFound = await this.inventoryService.getInventoryById(id);  
      return inventoryFound;  
    }  
  
    @Post('create')  
    async createInventory(  
      @Body() data: CreateInventoryEDCDto,  
      @Req() req: Request,  
      @User() user: any,  
    ) {  
      try {  
        const create = await this.inventoryService.createInventory(data);  
  
        // Audit log  
        
  
        return {  
          message: 'Success create Inventory',  
          data: create,  
        };  
      } catch (error) {  
        throw new BadRequestException(`Failed to create inventory: ${error.message}`);  
      }  
    }  
  
    @Put('update/:id')  
    async updateInventory(  
      @Param('id') id: number,  
      @Body() data: UpdateInventoryEDCDto,  
      @Req() req: Request,  
      @User() user: any,  
    ) {  
      try {  
        const oldData = await this.inventoryService.getInventoryById(id);  
        const update = await this.inventoryService.updateInventory(id, data);  
  
        // Audit log  
        await this.auditService.create({  
          Url: req.url,  
          ActionName: "Update Inventory",  
          MenuName: "Inventory Management",  
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
          message: 'Success update Inventory',  
          data: update,  
        };  
      } catch (error) {  
        throw new BadRequestException(`Failed to update inventory: ${error.message}`);  
      }  
    }  
  
    @Delete('delete/:id')  
    async deleteInventory(  
      @Param('id') id: number,  
      @Req() req: Request,  
      @User() user: any,  
    ) {  
      try {  
        const oldData = await this.inventoryService.getInventoryById(id);  
        await this.inventoryService.deleteInventory(id);  
  
        // Audit log  
        await this.auditService.create({  
          Url: req.url,  
          ActionName: "Delete Inventory",  
          MenuName: "Inventory Management",  
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
          message: 'Success delete Inventory',  
        };  
      } catch (error) {  
        throw new BadRequestException(`Failed to delete inventory: ${error.message}`);  
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