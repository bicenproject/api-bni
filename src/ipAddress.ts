
import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller()
export class IpController {
  @Get('ip')
  getIp(@Req() request: Request): string {
    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    return ip as string;
  }
}
