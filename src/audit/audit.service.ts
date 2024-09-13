import { Injectable } from '@nestjs/common';  
import { PrismaService } from '../prisma/prisma.service';  
@Injectable()  
export class AuditService {  
  constructor(private prisma: PrismaService) {}  

  async create(auditData: {  
    Url: string; 
    ActionName: string;  
    MenuName: string;  
    DataBefore: string;  
    DataAfter: string;  
    UserName: string;  
    IpAddress: string;  
    ActivityDate: Date;  
    Browser: string;  
    OS: string;  
    AppSource: string;  
    created_by: number;   
    updated_by: number;  
  }) {  
    return this.prisma.auditTrail.create({  
      data: {  
        Url: auditData.Url,  // Ensure this matches the model  
        ActionName: auditData.ActionName,  
        MenuName: auditData.MenuName,  
        DataBefore: auditData.DataBefore,  
        DataAfter: auditData.DataAfter,  
        UserName: auditData.UserName,  
        IpAddress: auditData.IpAddress,  
        ActivityDate: auditData.ActivityDate,  
        Browser: auditData.Browser,  
        OS: auditData.OS,  
        AppSource: auditData.AppSource,  
        created_by: auditData.created_by,   
        updated_by: auditData.updated_by,    
      },  
    });  
  }  

   async getAllLogs() {  
    return this.prisma.auditTrail.findMany({  
      orderBy: {  
        ActivityDate: 'desc',  
      },  
    });  

  }
}