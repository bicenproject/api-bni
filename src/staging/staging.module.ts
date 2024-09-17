import { StagingService } from './staging.service';
import { Module } from '@nestjs/common';  
import { StagingController } from './staging.controller';  
import { PrismaModule } from '../prisma/prisma.module'; // Adjust the path as necessary  
import { AuditService } from '../audit/audit.service'; // Adjust the path as necessary  

@Module({  
  imports: [PrismaModule],  
  controllers: [StagingController],  
  providers: [StagingService, AuditService],  
})  
export class StagingModule {}