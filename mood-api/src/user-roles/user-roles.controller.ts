import { Body, Controller, Get, Put, UseGuards, Request } from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin-guard';
import { UserJwtPayload } from '../auth/util';

import { Logger, Util } from '../util';
import { UserGuard } from '../auth/guards/user.guard';
import { UserRolesModel } from './user-roles.model';
import { UserRolesService } from './user-roles.service';

const logger = new Logger('UserRolesController');

@UseGuards(UserGuard)
@Controller('user-roles')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Get('mine')
  async mine(@Request() req: UserJwtPayload): Promise<UserRolesModel> {
    return this.userRolesService.toModel(
      await this.userRolesService.findOne({
        userId: req.user.id,
      }),
    );
  }

  @UseGuards(AdminGuard)
  @Put(':uid')
  async update(
    @Body() payload: Partial<UserRolesModel>,
  ): Promise<UserRolesModel> {
    Util.checkRequiredFields(payload, ['uid']);
    const userRolesEntity = await this.userRolesService.save(payload);
    return this.userRolesService.toModel(userRolesEntity);
  }
}
