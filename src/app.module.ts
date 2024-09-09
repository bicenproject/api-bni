import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { WilayahModule } from './wilayah/wilayah.module';
import { VendorModule } from './vendor/vendor.module';
import { MenuModule } from './menu/menu.module';
import { MenuRoleModule } from './menu-role/menu-role.module';
import { MerchantModule } from './merchant/merchant.module';

@Module({
  imports: [UserModule, WilayahModule, PrismaModule, VendorModule, MenuModule, MerchantModule],
  providers: [PrismaService],
})
export class AppModule {}
