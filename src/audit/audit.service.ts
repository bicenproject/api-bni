
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
  }) {
    return this.prisma.auditTrail.create({
      data: {
        ...auditData,
        updated_by: auditData.created_by,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }
}
