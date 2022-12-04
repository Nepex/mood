import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';

import { KeyVals, Logger, Util } from '../util';
import { UserGuard } from '../auth/guards/user.guard';
import { UserJwtPayload } from '../auth/util';
import { UserModel } from './user.model';
import { UserService } from './user.service';

const logger = new Logger('UserController');

@UseGuards(UserGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async me(@Request() req: UserJwtPayload): Promise<UserModel> {
    return await this.userService.toModel(
      await this.userService.findById(req.user.id),
    );
  }

  @Put(':uid')
  async update(
    @Request() req: UserJwtPayload,
    @Body() payload: Partial<UserModel>,
    @Param() params: KeyVals,
  ): Promise<UserModel> {
    let userEntity = await this.userService.findByUid(params.uid);
    Util.validateExists(userEntity);
    Util.validateUserSelfUpdate(req.user.id, userEntity.id);

    userEntity = await this.userService.save(payload);
    return await this.userService.toModel(userEntity);
  }
}
