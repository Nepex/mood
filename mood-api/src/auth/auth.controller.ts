import {
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { Credentials, RequestToken, Session } from '../utils/types';
import { Logger } from '../utils/logger';
import { RequestValidationService } from './request-validation.service';
import { User } from '../user/user.entity';
import { UserGuard } from './user.guard';
import { UserJwtPayload } from './utils';
import { UserModel } from '../user/user.model';
import { UserService } from '../user/user.service';
import { Util } from '../utils/util';

const logger = new Logger('AuthController');

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @Inject(forwardRef(() => RequestValidationService))
    private readonly validationService: RequestValidationService,
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
    await this.authService.register(user as User | any);
    logger.success(`${user.email} registered`);
  }
}
