import { Module } from '@nestjs/common';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditService } from '../audit/audit.service';

@Module({
  imports: [PrismaModule],
  controllers: [VendorController],
  providers: [VendorService, AuditService]
})
export class VendorModule {}
