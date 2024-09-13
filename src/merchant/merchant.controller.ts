
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  Req
} from '@nestjs/common';
import { Request } from 'express';
import { MerchantService } from './merchant.service';
import { CreateMerchantDto, UpdateMerchantDto } from './dtos/merchant.dto';
import { AuditService } from '../audit/audit.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { User } from '../decorators/curentuser.decorator';

@Controller('merchants')
@UseGuards(JwtAuthGuard)
export class MerchantController {
  constructor(
    private readonly merchantService: MerchantService,
    private readonly auditService: AuditService
  ) {}

  @Post()
  async create(
    @Body() createMerchantDto: CreateMerchantDto,
    @Req() req: Request,
    @User() user: any
  ) {
    const createdMerchant = await this.merchantService.create(createMerchantDto);

    // Audit log
    await this.auditService.create({
      Url: req.url,
      ActionName: "Create Merchant",
      MenuName: "Merchant Management",
      DataBefore: "",
      DataAfter: JSON.stringify(createdMerchant),
      UserName: user.username,
      IpAddress: req.ip,
      ActivityDate: new Date(),
      Browser: req.headers['user-agent'] || 'Unknown',
      OS: this.getOSFromUserAgent(req.headers['user-agent'] || '', req),
      AppSource: "Desktop",
      created_by: user.userId,
      updated_by: user.userId,
    });

    return createdMerchant;
  }

  @Get()
  findAll() {
    return this.merchantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.merchantService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateMerchantDto: UpdateMerchantDto,
    @Req() req: Request,
    @User() user: any
  ) {
    const oldData = await this.merchantService.findOne(+id);
    const updatedMerchant = await this.merchantService.update(+id, updateMerchantDto);

    // Audit log
    await this.auditService.create({
      Url: req.url,
      ActionName: "Update Merchant",
      MenuName: "Merchant Management",
      DataBefore: JSON.stringify(oldData),
      DataAfter: JSON.stringify(updatedMerchant),
      UserName: user.username,
      IpAddress: req.ip,
      ActivityDate: new Date(),
      Browser: req.headers['user-agent'] || 'Unknown',
      OS: this.getOSFromUserAgent(req.headers['user-agent'] || '', req),
      AppSource: "Desktop",
      created_by: user.userId,
      updated_by: user.userId,
    });

    return updatedMerchant;
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
    @User() user: any
  ) {
    const oldData = await this.merchantService.findOne(+id);
    const result = await this.merchantService.remove(+id);

    // Audit log
    await this.auditService.create({
      Url: req.url,
      ActionName: "Delete Merchant",
      MenuName: "Merchant Management",
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

    return result;
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
