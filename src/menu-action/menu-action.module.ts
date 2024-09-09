import { Module } from '@nestjs/common';
import { MenuActionController } from './menu-action.controller';
import { MenuActionService } from './menu-action.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports : [PrismaModule],
  controllers: [MenuActionController],
  providers: [MenuActionService]
})
export class MenuActionModule {}
