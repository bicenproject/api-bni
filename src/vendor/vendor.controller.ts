
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
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { VendorService } from './vendor.service';
import { CreateVendorDto, UpdateVendorDto } from './dtos/vendor.dto';
import { AuditService } from '../audit/audit.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { User } from '../decorators/curentuser.decorator';

@Controller('api')
@UseGuards(JwtAuthGuard)
export class VendorController {
  constructor(
    private readonly vendorService: VendorService,
    private readonly auditService: AuditService,
  ) {}

  @Get('vendor')
  async getAllVendor() {
    const data = await this.vendorService.getAllVendor();
    if (!data) throw new BadRequestException('Vendor does not exist');
    return {
      message: 'Data Vendor',
      ...data,
    };
  }

  @Get('vendor/:id')
  async getVendorById(@Param('id', ParseIntPipe) id: number) {
    const VendorFound = await this.vendorService.getVendorByid(Number(id));
    if (!VendorFound) throw new BadRequestException('Vendor does not exist');
    return VendorFound;
  }

  @Post('vendor/create')
  async createTask(
    @Body() data: CreateVendorDto,
    @Req() req: Request,
    @User() user: any
  ) {
    const create = await this.vendorService.createVendor(data);

    // Audit log
    await this.auditService.create({
      Url: req.url,
      ActionName: "Create Vendor",
      MenuName: "Vendor Management",
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
      message: 'success create Vendor',
      ...create,
    };
  }

  @Put('vendor/update/:id')  
  async updateVendor(  
    @Param('id', ParseIntPipe) id: number,  
    @Body() data: UpdateVendorDto,  
    @Req() req: Request,  
    @User() user: any  
  ) {  
    try {  
      const oldData = await this.vendorService.getVendorByid(id);  
      if (!oldData) {  
        throw new NotFoundException(`Vendor with ID ${id} not found`);  
      }  
      const updatedVendor = await this.vendorService.updateVendor(id, data);  

      await this.auditService.create({  
        Url: req.url,  
        ActionName: "Update Vendor",  
        MenuName: "Vendor Management",  
        DataBefore: JSON.stringify(oldData),  
        DataAfter: JSON.stringify(updatedVendor),  
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
        message: 'Vendor updated successfully',  
        data: updatedVendor,  
      };  
    } catch (error) {  
      console.error('Error updating vendor:', error);  
      if (error instanceof NotFoundException) {  
        throw error;  
      }  
      throw new BadRequestException(`Failed to update vendor: ${error.message}`);  
    }  
  }  



  @Delete('vendor/delete/:id')
  async deleteVendor(
    @Param('id', ParseIntPipe) id: string,
    @Req() req: Request,
    @User() user: any
  ) {
    try {
      const oldData = await this.vendorService.getVendorByid(Number(id));
      const deletes = await this.vendorService.deleteVendor(Number(id));

      // Audit log
      await this.auditService.create({
        Url: req.url,
        ActionName: "Delete Vendor",
        MenuName: "Vendor Management",
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
      throw new BadRequestException('Vendor does not exist');
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
