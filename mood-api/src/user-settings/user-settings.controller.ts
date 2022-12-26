import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';

import { KeyVals, Util } from '../util';
import { UserGuard } from '../auth/guards/user.guard';
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
      await this.userSettingsService.findOne([
        {
          userId: req.user.id,
        },
      ]),
    );
  }

  @Put(':uid')
  async update(
    @Request() req: UserJwtPayload,
    @Body() payload: Partial<UserSettingsModel>,
    @Param() params: KeyVals,
  ): Promise<UserSettingsModel> {
    let settings = await this.userSettingsService.findByUid(params.uid);
    Util.validateExists(settings);
    Util.validateUserSelfUpdate(req.user.id, settings.userId);

    settings = await this.userSettingsService.save(payload);
    return this.userSettingsService.toModel(settings);
  }
}
