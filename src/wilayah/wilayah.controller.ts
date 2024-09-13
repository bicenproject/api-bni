
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
} from '@nestjs/common';
import { Request } from 'express';
import { WilayahService } from './wilayah.service';
import { CreateWilayahDto } from './dtos/create.wilayah.dto';
import { UpdateWilayahDto } from './dtos/update.wilayah.dto';
import { AuditService } from '../audit/audit.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { User } from '../decorators/curentuser.decorator';

@Controller('api')
@UseGuards(JwtAuthGuard)
export class WilayahController {
  constructor(
    private readonly wilayahService: WilayahService,
    private readonly auditService: AuditService
  ) {}

  @Get('wilayah')
  async getAllWilayah() {
    const data = await this.wilayahService.getAllWilayah();
    if (!data) throw new BadRequestException('Wilayah does not exist');
    return {
      message: 'Data Wilayah',
      ...data,
    };
  }

  @Get('wilayah/:id')
  async getWilayahById(@Param('id', ParseIntPipe) id: number) {
    const WilayahFound = await this.wilayahService.getWilayahById(Number(id));
    if (!WilayahFound) throw new BadRequestException('Wilayah does not exist');
    return WilayahFound;
  }

  @Post('wilayah/create')
  async createWilayah(
    @Body() data: CreateWilayahDto,
    @Req() req: Request,
    @User() user: any
  ) {
    try {
      const create = await this.wilayahService.createWilayah(data);

      // Audit log
      await this.auditService.create({
        Url: req.url,
        ActionName: "Create Wilayah",
        MenuName: "Wilayah Management",
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
        message: 'Success create Wilayah',
        data: create,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to create wilayah: ${error.message}`,
      );
    }
  }

  @Put('wilayah/update/:id')
  async updateWilayah(
    @Param('id') id: string,
    @Body() data: UpdateWilayahDto,
    @Req() req: Request,
    @User() user: any
  ) {
    console.log('Received update request for wilayah:', id);
    console.log('Update data:', data);
    try {
      const oldData = await this.wilayahService.getWilayahById(Number(id));
      const update = await this.wilayahService.updateWilayah(Number(id), data);
      console.log('Update result:', update);

      // Audit log
      await this.auditService.create({
        Url: req.url,
        ActionName: "Update Wilayah",
        MenuName: "Wilayah Management",
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
        data: update,
      };
    } catch (error) {
      console.error('Error updating wilayah:', error);
      throw new BadRequestException('Failed to update wilayah: ' + error.message);
    }
  }

  @Delete('wilayah/delete/:id')
  async deleteWilayah(
    @Param('id') id: string,
    @Req() req: Request,
    @User() user: any
  ) {
    try {
      const oldData = await this.wilayahService.getWilayahById(Number(id));
      const deletes = await this.wilayahService.deleteWilayah(Number(id));

      // Audit log
      await this.auditService.create({
        Url: req.url,
        ActionName: "Delete Wilayah",
        MenuName: "Wilayah Management",
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
      throw new BadRequestException('Wilayah does not exist');
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
