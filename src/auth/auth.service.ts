import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

config();
const configService = new ConfigService();

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  validateUser(username: string, password: string): Promise<any> {
    if (
      username === configService.get('ADMIN_USERNAME') &&
      password === configService.get('ADMIN_PASSWORD')
    ) {
      return null;
    } else {
      throw new UnauthorizedException({ msg: 'You are not the admin' });
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
