import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { WilayahModule } from './wilayah/wilayah.module';
import { VendorModule } from './vendor/vendor.module';
import { MenuModule } from './menu/menu.module';
import { MerchantModule } from './merchant/merchant.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [UserModule, WilayahModule, PrismaModule, VendorModule, MenuModule, MerchantModule, AuditModule],
  providers: [PrismaService],
})
export class AppModule {}
