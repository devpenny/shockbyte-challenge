import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

interface ILoginDTO {
  username: string;
  password: string;
}

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: ILoginDTO): Promise<any> {
    return await this.authService.login(body);
  }
}
