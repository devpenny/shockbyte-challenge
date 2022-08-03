import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { JwtStrategy } from './jwt.strategy';

import { AuthService } from './auth.service';

config();
const configService = new ConfigService();

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: configService.get('AUTH_SECRET'),
      signOptions: { expiresIn: '600s' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
