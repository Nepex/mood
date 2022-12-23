import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { Credentials, Logger, Session } from '../util';
import { UserGuard } from './guards/user.guard';
import { UserJwtPayload } from './util';
import { UserModel } from '../user/user.model';
import { UserService } from '../user/user.service';

const logger = new Logger('AuthController');

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(UserGuard)
  @Get('me')
  async me(@Request() req: UserJwtPayload): Promise<UserModel> {
    return await this.userService.toModel(
      await this.userService.findById(req.user.id),
    );
  }

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
