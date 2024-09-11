import {
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
  
  async register(createDto: RegisterUsersDto): Promise<any> {
    const hashedPassword = await bcrypt.hash(createDto.password, 10);

    const user = await this.userService.createUser({
      ...createDto,
      password: hashedPassword,
      created_by: 0, // You might want to set this differently
      updated_by: 0, // You might want to set this differently
      isVerified: false,
      id_wilayah_vendor: 0, // You need to set this appropriately
      vendor_type: '', // You need to set this appropriately
      npp: '', // You need to set this appropriately
      dob: new Date(), // You need to set this appropriately
    });

    const tokens = await this.getTokens(user.id_user, user.email);
    await this.updateRefreshToken(user.id_user, tokens.refreshToken);

    return tokens;
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
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    const tokens = await this.getTokens(user.id_user, user.email);
    await this.updateRefreshToken(user.id_user, tokens.refreshToken);

    return tokens;
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
}
