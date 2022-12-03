import { Body, Controller, Put, Request, UseGuards } from '@nestjs/common';

import { Logger, Util } from '../util';
import { UserGuard } from '../auth/user.guard';
import { UserJwtPayload } from '../auth/util';
import { UserModel } from './user.model';
import { UserService } from './user.service';

const logger = new Logger('UserController');

@UseGuards(UserGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put(':uid')
  async update(
    @Request() req: UserJwtPayload,
    @Body() payload: Partial<UserModel>,
  ): Promise<UserModel> {
    const user = await this.userService.findByUid(payload.uid);
    Util.validateUserSelfUpdate(req.user.id, user.id);

    const entity = await this.userService.save(payload);
    return await this.userService.toModel(entity);
  }
}
