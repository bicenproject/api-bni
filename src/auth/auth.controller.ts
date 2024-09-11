import { Controller, Post, Body, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { RegisterUsersDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { AuditService } from '../audit/audit.service'; // Import the AuditService

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly auditService: AuditService, // Inject the AuditService
  ) {}

  @Post('/login')  
  async login(  
    @Req() request: Request,  
    @Res() response: Response,  
    @Body() loginDto: LoginDto,  
  ): Promise<any> {  
    try {  
      const result = await this.authService.login(loginDto);  

      const userAgent = request.headers['user-agent'] || 'Unknown';  
      const ipAddress = request.ip || 'Unknown';  
      
      await this.auditService.create({  
        Url: "/auth/login",  
        ActionName: "sign in",  
        MenuName: "sign in",  
        DataBefore: "",  
        DataAfter: JSON.stringify(result),  
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

  private getBrowserFromUserAgent(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    return 'Unknown';
  }

  private getOSFromUserAgent(userAgent: string, request: Request): string {  
    const testOS = request.headers['x-test-os'];  
    if (/PostmanRuntime/i.test(userAgent)) return 'Postman (Testing Environment)';  
    if (/windows nt 10/i.test(userAgent)) return 'Windows 10';  
    if (/mac os x/i.test(userAgent)) return 'macOS';  
    if (testOS) return testOS as string;      
    if (userAgent.includes('Win')) return 'Windows';
    if (userAgent.includes('Mac')) return 'MacOS';
    if (userAgent.includes('Linux')) return 'Linux';
    return 'Unknown';
  }
}
