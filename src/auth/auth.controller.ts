
import { Controller, Post, Body, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { RegisterUsersDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './guards/refreshToken.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Res() response: Response,
    @Body() loginDto: LoginDto,
  ): Promise<any> {
    try {
      const result = await this.authService.login(loginDto);
      return response.status(200).json({
        status: 'Ok!',
        message: 'Successfully login!',
        result: result,
      });
    } catch (err) {
      return response.status(err.status || 500).json({
        status: 'Error!',
        message: err.message || 'Internal Server Error!',
      });
    }
  }

  @Post('/register')
  async register(
    @Res() response: Response,
    @Body() registerDto: RegisterUsersDto,
  ): Promise<any> {
    try {
      const result = await this.authService.register(registerDto);
      return response.status(200).json({
        status: 'Ok!',
        message: 'Successfully register user!',
        result: result,
      });
    } catch (err) {
      return response.status(err.status || 500).json({
        status: 'Error!',
        message: err.message || 'Internal Server Error!',
      });
    }
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(@Req() req: Request, @Res() res: Response) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    try {
      const tokens = await this.authService.refreshTokens(userId, refreshToken);
      return res.status(200).json({
        status: 'Ok!',
        message: 'Tokens refreshed successfully!',
        result: tokens,
      });
    } catch (err) {
      return res.status(err.status || 500).json({
        status: 'Error!',
        message: err.message || 'Internal Server Error!',
      });
    }
  }
}
