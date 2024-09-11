import { Controller, Get } from '@nestjs/common';  
import { AuditService } from './audit.service';  

@Controller('audit')  
export class AuditController {  
  constructor(private readonly auditService: AuditService) {}  

  // Example endpoint to get all audit logs  
  @Get()  
  async getAllLogs() {  
    return this.auditService.getAllLogs();  
  }  
}