import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { Util } from 'src/util';

import { UserGuard } from '../auth/user.guard';
import { UserJwtPayload } from '../auth/util';
import { UserSettingsModel } from './user-settings.model';
import { UserSettingsService } from './user-settings.service';

@UseGuards(UserGuard)
@Controller('user-settings')
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @Get('mine')
  async mine(@Request() req: UserJwtPayload): Promise<UserSettingsModel> {
    return this.userSettingsService.toModel(
      await this.userSettingsService.findOne({
        userId: req.user.id,
      }),
    );
  }

  @Put(':uid')
  async update(
    @Request() req: UserJwtPayload,
    @Body() payload: Partial<UserSettingsModel>,
  ): Promise<UserSettingsModel> {
    const settings = await this.userSettingsService.findByUid(payload.uid);
    Util.validateUserSelfUpdate(req.user.id, settings.userId);

    const entity = await this.userSettingsService.save(payload);
    return this.userSettingsService.toModel(entity);
  }
}
