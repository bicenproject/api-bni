import { Module } from '@nestjs/common';
import { GroupWilayahService } from './group_wilayah.service';
import { GroupWilayahController } from './group_wilayah.controller';
import { PrismaModule } from '../prisma/prisma.module';


@Module({
  imports: [PrismaModule],
  controllers: [GroupWilayahController],
  providers: [GroupWilayahService]
})
export class GroupWilayahModule {}
