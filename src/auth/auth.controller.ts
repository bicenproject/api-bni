import { Controller, Post, Body, Req, Res, UseGuards, UnauthorizedException, Get, Param, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { RegisterUsersDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { AuditService } from '../audit/audit.service'; 
import { JwtAuthGuard } from './guards/auth.guard';
import { User } from '../decorators/curentuser.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly auditService: AuditService, 
  ) {}

  @Post('/login')  
  async login(  
    @Req() request: Request,  
    @Res() response: Response,  
    @Body() loginDto: LoginDto,  
  ): Promise<any> {  
    try {  
      const result = await this.authService.login(loginDto);  

      // Set cookies  
      this.setTokenCookies(response, result.accessToken, result.refreshToken);  

      const userAgent = request.headers['user-agent'] || 'Unknown';  
      const ipAddress = this.getIpAddress(request);  
      
      await this.auditService.create({  
        Url: "/auth/login",  
        ActionName: "sign in",  
        MenuName: "sign in",  
        DataBefore: "",  
        DataAfter: JSON.stringify({ userId: result.userId, username: result.username }),  
        UserName: result.username,  
        IpAddress: ipAddress,  
        ActivityDate: new Date(),  
        Browser: this.getBrowserFromUserAgent(userAgent),  
        OS: this.getOSFromUserAgent(userAgent, request),   
        AppSource: "Desktop",  
        created_by: result.userId || 0,  
        updated_by: result.userId || 0,  
      });  

      return response.status(200).json({  
        status: 'Ok!',  
        message: 'Successfully login!',  
        user: { userId: result.userId, username: result.username },  
      });  
    } catch (err) {  
      return response.status(err.status || 500).json({  
        status: 'Error!',  
        message: err.message || 'Internal Server Error!',  
      });  
    }  
  }  

  @UseGuards(JwtAuthGuard)  
  @Post('/logout')  
  async logout(@Req() req: Request, @Res() res: Response, @User() user: any): Promise<any> {  
    try {  
      const userId = user.userId;   
      if (!userId) {  
        throw new UnauthorizedException('Invalid user ID');  
      }  

      await this.authService.logout(userId);  

      // Clear cookies  
      this.clearTokenCookies(res);  

      await this.auditService.create({  
        Url: "/auth/logout",  
        ActionName: "sign out",  
        MenuName: "Autentikasi",  
        DataBefore: "",  
        DataAfter: "",  
        UserName: user.username,  
        IpAddress: req.ip,  
        ActivityDate: new Date(),  
        Browser: req.headers['user-agent'] || 'Unknown',  
        OS: this.getOSFromUserAgent(req.headers['user-agent'] || '', req),  
        AppSource: "Desktop",  
        created_by: userId,  
        updated_by: userId,  
      });  

      return res.status(200).json({  
        status: 'Ok!',  
        message: 'Successfully logged out!',  
      });  
    } catch (err) {  
      console.error('Logout error:', err);  
      return res.status(err.status || 500).json({  
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
      
      // Set cookies  
      this.setTokenCookies(response, result.accessToken, result.refreshToken);  

      return response.status(200).json({  
        status: 'Ok!',  
        message: 'Successfully register user!',  
        user: { userId: result.userId, username: result.username },  
      });  
    } catch (err) {  
      return response.status(err.status || 500).json({  
        status: 'Error!',  
        message: err.message || 'Internal Server Error!',  
      });  
    }  
  }  
  
  @UseGuards(RefreshTokenGuard)  
  @Post('/refresh')  
  async refreshTokens(@Req() req: Request, @Res() res: Response) {  
    const userId = req.user['sub'];  
    const refreshToken = req.cookies['refreshToken'];  
    const tokens = await this.authService.refreshTokens(userId, refreshToken);  
    this.setTokenCookies(res, tokens.accessToken, tokens.refreshToken);  
    return res.json({ message: 'Tokens refreshed successfully' });  
  }  

  @UseGuards(JwtAuthGuard)  
  @Get('/check')  
  async checkAuth(@User() user: any) {  
    return { isAuthenticated: true, user: { userId: user.userId, username: user.username } };  
  }  

  private setTokenCookies(res: Response, accessToken: string, refreshToken: string) {  
    res.cookie('accessToken', accessToken, {  
      httpOnly: true,  
      secure: process.env.NODE_ENV === 'production',  
      sameSite: 'none' as const,  
      maxAge: 15 * 60 * 1000,  
    });  

    res.cookie('refreshToken', refreshToken, {  
      httpOnly: true,  
      secure: process.env.NODE_ENV === 'production',  
      sameSite: 'strict',  
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days  
    });  
  }  

  private clearTokenCookies(res: Response) {  
    res.clearCookie('accessToken');  
    res.clearCookie('refreshToken');  
  }  


  @UseGuards(JwtAuthGuard)  
  @Post('/change-password')  
  async changePassword(  
    @Req() req: Request,  
    @Res() res: Response,  
    @User() user: any,  
    @Body() changePasswordDto: ChangePasswordDto,  
  ): Promise<any> {  
    try {  
      await this.authService.changePassword(user.userId, changePasswordDto);  

      const userAgent = req.headers['user-agent'] || 'Unknown';  
      const ipAddress = this.getIpAddress(req);  

      await this.auditService.create({  
        Url: "/auth/change-password",  
        ActionName: "change password",  
        MenuName: "Autentikasi",  
        DataBefore: "",  
        DataAfter: "",  
        UserName: user.username,  
        IpAddress: ipAddress,  
        ActivityDate: new Date(),  
        Browser: this.getBrowserFromUserAgent(userAgent),  
        OS: this.getOSFromUserAgent(userAgent, req),  
        AppSource: "Desktop",  
        created_by: user.userId,  
        updated_by: user.userId,  
      });  

      return res.status(200).json({  
        status: 'Ok!',  
        message: 'Password changed successfully!',  
      });  
    } catch (err) {  
      if (err instanceof UnauthorizedException || err instanceof BadRequestException) {  
        return res.status(err.getStatus()).json({  
          status: 'Error!',  
          message: err.message,  
        });  
      }  
      return res.status(500).json({  
        status: 'Error!',  
        message: 'Internal Server Error!',  
      });  
    }  
  }  


  private getBrowserFromUserAgent(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    return 'Unknown';
  }

  private getOSFromUserAgent(userAgent: string, request: Request): string {  
    const testOS = request.headers['x-test-os'];  
    if (/PostmanRuntime/i.test(userAgent)) return 'Postman (Testing Environment)';  
    if (testOS) return testOS as string;      
    if (userAgent.includes('Win')) return 'Windows';
    if (userAgent.includes('Mac')) return 'MacOS';
    if (userAgent.includes('Linux')) return 'Linux';
    return 'Unknown';
  }

  private getIpAddress(request: Request): string {  
    const forwardedFor = request.headers['x-forwarded-for'];  
    if (forwardedFor) {  
      if (typeof forwardedFor === 'string') {  
        return forwardedFor.split(',')[0];  
      } else if (Array.isArray(forwardedFor)) {  
        return forwardedFor[0];  
      }  
    }  
    return request.ip || request.connection.remoteAddress || 'Unknown';  
  }   
}
