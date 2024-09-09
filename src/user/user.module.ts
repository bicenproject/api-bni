import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { RoleModule } from '../role/role.module';
import { RoleActionModule } from '../role-action/role-action.module';

@Module({
  imports: [AuthModule, RoleModule, RoleActionModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
