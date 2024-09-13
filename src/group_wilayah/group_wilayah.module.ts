import { Module } from '@nestjs/common';
import { GroupWilayahService } from './group_wilayah.service';
import { GroupWilayahController } from './group_wilayah.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditService } from '../audit/audit.service';


@Module({
  imports: [PrismaModule],
  controllers: [GroupWilayahController],
  providers: [GroupWilayahService, AuditService]
})
export class GroupWilayahModule {}
