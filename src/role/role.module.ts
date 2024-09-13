import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditService } from '../audit/audit.service';

@Module({
  imports: [PrismaModule],
  controllers: [RoleController],
  providers: [RoleService, AuditService],
})
export class RoleModule {}