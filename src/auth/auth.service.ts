import {  
  BadRequestException,  
  Injectable,  
  NotFoundException,  
  UnauthorizedException,  
} from '@nestjs/common';  
import { JwtService } from '@nestjs/jwt';  
import * as bcrypt from 'bcrypt';  
import { UserService } from '../user/user.service';  
import { LoginDto } from './dto/login.dto';  
import { RegisterUsersDto } from './dto/register.dto';  
import { PrismaService } from '../prisma/prisma.service';  
import { ChangePasswordDto } from './dto/change-password.dto';  

@Injectable()  
export class AuthService {  
  constructor(  
    private readonly prismaService: PrismaService,  
    private jwtService: JwtService,  
    private readonly userService: UserService,  
  ) {}  

  async login(loginDto: LoginDto): Promise<any> {  
    const { email, password } = loginDto;  

    const user = await this.prismaService.user.findUnique({  
      where: { email },  
      select: {  
        id_user: true,  
        email: true,  
        password: true,  
        username: true,  
      },  
    });  

    if (!user) {  
      throw new NotFoundException('User not found');  
    }  

    const validatePassword = await bcrypt.compare(password, user.password);  

    if (!validatePassword) {  
      throw new UnauthorizedException('Invalid password');  
    }  

    const tokens = await this.getTokens(user.id_user, user.email);  
    await this.updateRefreshToken(user.id_user, tokens.refreshToken);  

    return {  
      ...tokens,  
      userId: user.id_user,  
      username: user.username,  
    };  
  }  
  
  async logout(userId: number): Promise<void> {  
    try {  
      const user = await this.prismaService.user.findUnique({  
        where: { id_user: userId },  
      });  

      if (!user) {  
        throw new NotFoundException('User not found');  
      }  

      await this.prismaService.user.update({  
        where: { id_user: userId },  
        data: {  
          refreshToken: null,  
          refreshTokenExpiryTime: null,  
        },  
      });  
    } catch (error) {  
      console.error('Error during logout:', error);  
      throw new Error('Failed to logout user');  
    }  
  }  

  async refreshTokens(userId: number, refreshToken: string): Promise<any> {  
    const user = await this.prismaService.user.findUnique({  
      where: { id_user: userId },  
    });  

    if (!user || !user.refreshToken) {  
      throw new UnauthorizedException('Access Denied');  
    }  

    const refreshTokenMatches = await bcrypt.compare(  
      refreshToken,  
      user.refreshToken  
    );  

    if (!refreshTokenMatches) {  
      throw new UnauthorizedException('Access Denied');  
    }  

    const tokens = await this.getTokens(user.id_user, user.email);  
    await this.updateRefreshToken(user.id_user, tokens.refreshToken);  

    return tokens;  
  }  
  
  async register(createDto: RegisterUsersDto): Promise<any> {  
    const hashedPassword = await bcrypt.hash(createDto.password, 10);  

    // Assuming you have a way to get the userId for created_by and updated_by  
    const userId = 0; // Replace with the actual userId you want to use  

    const user = await this.userService.createUser({  
      ...createDto,  
      password: hashedPassword,  
      created_by: userId,  
      updated_by: userId,  
      isVerified: false,  
      id_wilayah_vendor: 0,  
      vendor_type: '',  
      npp: '',  
      dob: new Date(),  
    }, ); // Added userId as the second argument  

    const tokens = await this.getTokens(user.id_user, user.email);  
    await this.updateRefreshToken(user.id_user, tokens.refreshToken);  

    return {  
      ...tokens,  
      userId: user.id_user,  
      username: user.username,  
    };  
  }  

  async updateRefreshToken(  
    userId: number,  
    refreshToken: string,  
  ): Promise<void> {  
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);  
    await this.prismaService.user.update({  
      where: { id_user: userId },  
      data: {  
        refreshToken: hashedRefreshToken,  
        refreshTokenExpiryTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now  
      },  
    });  
  }  

  async getTokens(userId: number, email: string) {  
    const [accessToken, refreshToken] = await Promise.all([  
      this.jwtService.signAsync(  
        { sub: userId, email },  
        {  
          secret: process.env.JWT_SECRET,  
          expiresIn: process.env.JWT_EXPIRES_IN,  
        },  
      ),  
      this.jwtService.signAsync(  
        { sub: userId, email },  
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },  
      ),  
    ]);  

    return {  
      accessToken,  
      refreshToken,  
    };  
  }  

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<void> {  
    const { currentPassword, newPassword, confirmNewPassword } = changePasswordDto;  

    if (newPassword !== confirmNewPassword) {  
      throw new BadRequestException('New password and confirmation do not match');  
    }  

    const user = await this.prismaService.user.findUnique({  
      where: { id_user: userId },  
      select: { password: true },  
    });  

    if (!user) {  
      throw new UnauthorizedException('User not found');  
    }  

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);  

    if (!isPasswordValid) {  
      throw new UnauthorizedException('Current password is incorrect');  
    }  

    if (currentPassword === newPassword) {  
      throw new BadRequestException('New password must be different from the current password');  
    }  

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);  

    await this.prismaService.user.update({  
      where: { id_user: userId },  
      data: { password: hashedNewPassword },  
    });  
  }  
}