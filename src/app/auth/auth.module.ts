import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwt_config } from 'src/config/jwt.config';
import { JwtAccessTokenStrategy } from './jwtAccessToken.strategy';
import { JwtRefreshTokenStrategy } from './jwtRefreshToken.strategy';
import { MailModule } from '../mail/mail.module';
import { ResetPassword } from '../mail/reset_password.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ResetPassword]),
    JwtModule.register({
      global: true,
      signOptions: {
        algorithm: 'HS384',
      },
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessTokenStrategy, JwtRefreshTokenStrategy],
})
export class AuthModule {}
