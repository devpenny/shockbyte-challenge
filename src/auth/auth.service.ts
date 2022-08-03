import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();
const configService = new ConfigService();

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  validateUser(username: string, password: string): Promise<any> {
    if (credentialsDoesntMatch(username, password)) {
      throw new UnauthorizedException({ msg: 'You are not authorized' });
    }
  }

  async login(user: any) {
    await this.validateUser(user.username, user.password);

    const payload = { username: user.username, sub: process.env.ADMIN_ID };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

function credentialsDoesntMatch(username: string, password: string): Boolean {
  return username !== configService.get('ADMIN_USERNAME') ||
    password !== configService.get('ADMIN_PASSWORD')
}