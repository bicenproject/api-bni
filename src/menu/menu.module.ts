import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MenuActionModule } from '../menu-action/menu-action.module';
import { MenuRoleModule } from '../menu-role/menu-role.module';
import { AuditService } from '../audit/audit.service';

@Module({
  imports : [PrismaModule, MenuActionModule, MenuRoleModule],
  controllers: [MenuController],
  providers: [MenuService, AuditService]
})
export class MenuModule {}
