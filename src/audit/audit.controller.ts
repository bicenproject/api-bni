
import { Controller, Post, Body, Ip, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuditService } from './audit.service';

@Controller('audit')
export class AuditTrailController {
  constructor(private readonly auditTrailService: AuditService) {}

  @Post()
  async createAuditTrail(@Body() auditData: any, @Ip() ip: string, @Req() request: Request) {
    const userAgent = request.headers['user-agent'];
    
    const enrichedAuditData = {
      ...auditData,
      IpAddress: ip,
      ActivityDate: new Date(),
      Browser: this.getBrowserFromUserAgent(userAgent),
      OS: this.getOSFromUserAgent(userAgent),
    };

    return this.auditTrailService.create(enrichedAuditData);
  }

  private getBrowserFromUserAgent(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    return 'Unknown';
  }

  private getOSFromUserAgent(userAgent: string): string {
    if (userAgent.includes('Win')) return 'Windows';
    if (userAgent.includes('Mac')) return 'MacOS';
    if (userAgent.includes('Linux')) return 'Linux';
    return 'Unknown';
  }
}
