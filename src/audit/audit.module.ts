import { Module } from '@nestjs/common';
import { AuditTrailController } from './audit.controller';
import { AuditService } from './audit.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AuditTrailController],
  providers: [AuditService]
})
export class AuditModule {}
