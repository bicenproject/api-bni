import { Module } from '@nestjs/common';  
import { MerchantService } from './merchant.service';  
import { MerchantController } from './merchant.controller';  
import { PrismaModule } from '../prisma/prisma.module';
import { AuditService } from '../audit/audit.service';

@Module({  
  imports : [PrismaModule],
  controllers: [MerchantController],  
  providers: [MerchantService, AuditService],  
})  
export class MerchantModule {}