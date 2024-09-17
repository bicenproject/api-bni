
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
  import { StagingService } from './staging.service';
  import { CreateStagingDto } from './dtos/createStaging.dto';
  import { UpdateStagingDto } from './dtos/updateStaging.dto';  
  import { AuditService } from '../audit/audit.service';
  import { JwtAuthGuard } from '../auth/guards/auth.guard';
  import { User } from '../decorators/curentuser.decorator';
  
  @Controller('staging')
  export class StagingController {
    constructor(
      private readonly stagingService: StagingService,
      private readonly auditService: AuditService,
    ) {}
  
    @Get()
    async getAllStaging() {
      const data = await this.stagingService.getAllStaging();
      return {
        message: 'Data Staging',
        data,
      };
    }
  
    @Get(':id_staging')
    async getStagingById(@Param('id_staging', ParseIntPipe) id_staging: number) {
      const stagingFound = await this.stagingService.getStagingById(id_staging);
      return stagingFound;
    }
  
    @Post('create')
    async createStaging(
      @Body() data: CreateStagingDto,
      @Req() req: Request,
      @User() user: any,
    ) {
      try {
        const create = await this.stagingService.createStaging(data);
  
        // Audit log
      
  
        return {
          message: 'Success create Staging',
          data: create,
        };
      } catch (error) {
        throw new BadRequestException(`Failed to create staging: ${error.message}`);
      }
    }
  
    @Put('update/:id_staging')
    async updateStaging(
      @Param('id_staging') id_staging: number,
      @Body() data: UpdateStagingDto,
      @Req() req: Request,
      @User() user: any,
    ) {
      try {
        const oldData = await this.stagingService.getStagingById(id_staging);
        const update = await this.stagingService.updateStaging(id_staging, data);
  
        // Audit log
        await this.auditService.create({
          Url: req.url,
          ActionName: 'Update Staging',
          MenuName: 'Staging Management',
          DataBefore: JSON.stringify(oldData),
          DataAfter: JSON.stringify(update),
          UserName: user.username,
          IpAddress: req.ip,
          ActivityDate: new Date(),
          Browser: req.headers['user-agent'] || 'Unknown',
          OS: this.getOSFromUserAgent(req.headers['user-agent'] || '', req),
          AppSource: 'Desktop',
          created_by: user.userId,
          updated_by: user.userId,
        });
  
        return {
          message: 'Success update Staging',
          data: update,
        };
      } catch (error) {
        throw new BadRequestException(`Failed to update staging: ${error.message}`);
      }
    }
  
    @Delete('delete/:id_staging')
    async deleteStaging(
      @Param('id_staging') id_staging: number,
      @Req() req: Request,
      @User() user: any,
    ) {
      try {
        const oldData = await this.stagingService.getStagingById(id_staging);
        await this.stagingService.deleteStaging(id_staging);
  
        // Audit log
        await this.auditService.create({
          Url: req.url,
          ActionName: 'Delete Staging',
          MenuName: 'Staging Management',
          DataBefore: JSON.stringify(oldData),
          DataAfter: '',
          UserName: user.username,
          IpAddress: req.ip,
          ActivityDate: new Date(),
          Browser: req.headers['user-agent'] || 'Unknown',
          OS: this.getOSFromUserAgent(req.headers['user-agent'] || '', req),
          AppSource: 'Desktop',
          created_by: user.userId,
          updated_by: user.userId,
        });
  
        return {
          message: 'Success delete Staging',
        };
      } catch (error) {
        throw new BadRequestException(`Failed to delete staging: ${error.message}`);
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
  