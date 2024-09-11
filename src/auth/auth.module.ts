import { Module } from '@nestjs/common';  
import { AuthController } from './auth.controller';  
import { PassportModule } from '@nestjs/passport';  
import { JwtModule } from '@nestjs/jwt';  
import { PrismaService } from '../prisma/prisma.service';  
import { AuthService } from './auth.service';  
import { UserService } from '../user/user.service';  
import { JwtStrategy } from './strategies/jwt.strategy';  
import { ConfigModule, ConfigService } from '@nestjs/config';  
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';  
import { AuditModule } from '../audit/audit.module'; 

@Module({  
  imports: [  
    PassportModule,  
    ConfigModule.forRoot(),  
    JwtModule.registerAsync({  
      imports: [ConfigModule],  
      useFactory: async (configService: ConfigService) => ({  
        secret: process.env.JWT_SECRET,  
        signOptions: {   
          expiresIn: process.env.JWT_EXPIRES_IN,  
        },  
      }),  
      inject: [ConfigService],  
    }),  
    AuditModule,
  ],  
  controllers: [AuthController],  
  providers: [  
    AuthService,   
    PrismaService,   
    JwtStrategy,   
    RefreshTokenStrategy,   
    UserService,  
    ConfigService  
  ],  
})  
export class AuthModule {}