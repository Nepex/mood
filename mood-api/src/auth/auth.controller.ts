import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { Credentials, Logger, Session } from '../util';
import { UserModel } from '../user/user.model';

const logger = new Logger('AuthController');

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() req: Credentials): Promise<Session> {
    const user = await this.authService.validateLogin(req.email, req.password);
    return await this.authService.login(user);
  }

  @Post('register')
  async create(@Body() user: Partial<UserModel>) {
    await this.authService.register(user);
    logger.success(`create(): ${user.email} registered`);
  }
}
