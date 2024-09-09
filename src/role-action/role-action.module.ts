import { Module } from '@nestjs/common';
import { RoleActionController } from './role-action.controller';
import { RoleActionService } from './role-action.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports : [
    PrismaModule
  ],
  controllers: [RoleActionController],
  providers: [RoleActionService]
})
export class RoleActionModule {}
