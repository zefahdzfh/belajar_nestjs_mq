import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { RegisterDto, ResetPasswordDto } from './auth.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { get } from 'http';
import { JwtAccessTokenStrategy } from './jwtAccessToken.strategy';
import { JwtGuard, JwtGuardRefreshToken } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  async register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }
  @Post('login')
  async login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  async profile(@Req() req) {
    console.log('informasi user login', req.user);

    const { id } = req.user;
    return this.authService.myProfile(id);
  }

  @UseGuards(JwtGuardRefreshToken)
  @Get('refresh-token')
  async refreshToken(@Req() req) {
    const token = req.headers.authorization.split(' ')[1];
    const id = req.headers.id;
    return this.authService.refreshToken(+id, token);
  }

  @Post('lupa-password')
  async forgptPassword(@Body('email') email: string) {
    console.log('email', email);
    return this.authService.forgotPassword(email);
  }

  // const link = `http://localhost:5002/auth/reset-password/${user.id}/${token}`;

  @Post('reset-password/:user_id/:token') // url yang dibuat pada endpont harus sama dengan ketika kita membuat link pada service forgotPassword
  async resetPassword(
    @Param('user_id') user_id: string,
    @Param('token') token: string,
    @Body() payload: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(+user_id, token, payload);
  }
}
