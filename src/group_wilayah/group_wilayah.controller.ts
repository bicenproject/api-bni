
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
import { GroupWilayahService } from './group_wilayah.service';
import { CreateGroupWilayahDto, UpdateGroupWilayahDto } from './dtos/group.dto';
import { AuditService } from '../audit/audit.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { User } from '../decorators/curentuser.decorator';

@Controller('api')
@UseGuards(JwtAuthGuard)
export class GroupWilayahController {
  constructor(
    private readonly groupWilayahService: GroupWilayahService,
    private readonly auditService: AuditService,
  ) {}

  @Get('getGrupWilayah')
  async getAllGroup_Wilayah() {
    const data = await this.groupWilayahService.getAllGroup_Wilayah();
    if (!data) throw new BadRequestException('Group_Wilayah does not exist');
    return {
      message: 'Data Wilayah',
      ...data,
    };
  }

  @Get('getGrupWilayah/:id')
  async getGroup_WilayahById(@Param('id', ParseIntPipe) id: number) {
    const Group_WilayahFound = await this.groupWilayahService.getGroup_WilayahByid_group(Number(id));
    if (!Group_WilayahFound)
      throw new BadRequestException('Group_Wilayah does not exist');
    return Group_WilayahFound;
  }

  @Post('getGrupWilayah/create')
  async createGroup_Wilayah(
    @Body() data: CreateGroupWilayahDto,
    @Req() req: Request,
    @User() user: any
  ) {
    const create = await this.groupWilayahService.createGroup_Wilayah(data);
    
    // Audit log
    await this.auditService.create({
      Url: req.url,
      ActionName: "Create Group Wilayah",
      MenuName: "Group Wilayah",
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
      message: 'success create Group_Wilayah',
      ...create,
    };
  }

  @Put('getGrupWilayah/update/:id')
  async updateGroup_Wilayah(
    @Param('id') id: string,
    @Body() data: UpdateGroupWilayahDto,
    @Req() req: Request,
    @User() user: any
  ) {
    try {
      const oldData = await this.groupWilayahService.getGroup_WilayahByid_group(Number(id));
      const update = await this.groupWilayahService.updateGroup_Wilayah(Number(id), data);
      
      // Audit log
      await this.auditService.create({
        Url: req.url,
        ActionName: "Update Group Wilayah",
        MenuName: "Group Wilayah",
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
      throw new BadRequestException('Group_Wilayah does not exist');
    }
  }

  @Delete('getGrupWilayah/delete/:id')
  async deleteGroup_Wilayah(
    @Param('id') id: string,
    @Req() req: Request,
    @User() user: any
  ) {
    try {
      const oldData = await this.groupWilayahService.getGroup_WilayahByid_group(Number(id));
      const deletes = await this.groupWilayahService.deleteGroup_Wilayah(Number(id));
      
      // Audit log
      await this.auditService.create({
        Url: req.url,
        ActionName: "Delete Group Wilayah",
        MenuName: "Group Wilayah",
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
      throw new BadRequestException('Group_Wilayah does not exist');
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
