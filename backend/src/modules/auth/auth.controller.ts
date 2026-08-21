import { Controller, Post, Get, Res, Req, UnauthorizedException, HttpCode, Body } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('guest')
  @HttpCode(200)
  async loginGuest(@Res({ passthrough: true }) res: Response) {
    const { user, token } = await this.authService.loginGuest();
    this.setCookie(res, token);
    return { user };
  }

  @Post('register')
  @HttpCode(201)
  async register(
    @Body() registerDto: import('./dto/register.dto.js').RegisterDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { user, token } = await this.authService.register(registerDto);
    this.setCookie(res, token);
    return { user };
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginDto: import('./dto/login.dto.js').LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { user, token } = await this.authService.login(loginDto);
    this.setCookie(res, token);
    return { user };
  }

  private setCookie(res: Response, token: string) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  @Get('me')
  async getMe(@Req() req: Request) {
    const token = req.cookies?.['auth_token'];
    if (!token) {
      throw new UnauthorizedException('Not authenticated');
    }

    const user = await this.authService.verifyToken(token);
    return { user };
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    });
    return { success: true };
  }
}
