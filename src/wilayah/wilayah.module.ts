import { Module } from '@nestjs/common';
import { WilayahController } from './wilayah.controller';
import { WilayahService } from './wilayah.service';
import { PrismaModule } from '../prisma/prisma.module';
import { GroupWilayahModule } from '../group_wilayah/group_wilayah.module';

@Module({
  imports : [PrismaModule, GroupWilayahModule],
  controllers: [WilayahController],
  providers: [WilayahService]
})
export class WilayahModule {}
