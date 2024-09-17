import { Module } from '@nestjs/common';  
import { InventoryController } from './inventory.controller';  
import { InventoryService } from './inventory.service';  
import { PrismaModule } from '../prisma/prisma.module'; // Adjust the path as necessary  
import { AuditService } from '../audit/audit.service'; // Adjust the path as necessary  

@Module({  
  imports: [PrismaModule],  
  controllers: [InventoryController],  
  providers: [InventoryService, AuditService],  
})  
export class InventoryModule {}