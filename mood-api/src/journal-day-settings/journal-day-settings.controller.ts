import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';

import { KeyVals, Logger, Util } from '../util';
import { UserGuard } from '../auth/guards/user.guard';
import { UserJwtPayload } from '../auth/util';
import { JournalDaySettingsService } from './journal-day-settings.service';
import { JournalDaySettingsModel } from './journal-day-settings.model';

const logger = new Logger('JournalDaySettingsController');

@UseGuards(UserGuard)
@Controller('journal-day-settings')
export class JournalDaySettingsController {
  constructor(
    private readonly journalDaySettingsService: JournalDaySettingsService,
  ) {}

  // TODO: validate user can only pull their entries
  // @Get('me')
  // async search(@Request() req: UserJwtPayload): Promise<UserModel> {
  //   return await this.userService.toModel(
  //     await this.userService.findById(req.user.id),
  //   );
  // }

  @Post()
  async create(
    @Request() req: UserJwtPayload,
    @Body() payload: Partial<JournalDaySettingsModel>,
  ): Promise<JournalDaySettingsModel> {
    const journalEntryEntity = await this.journalDaySettingsService.save(
      payload,
    );
    return this.journalDaySettingsService.toModel(journalEntryEntity);
  }

  @Put(':uid')
  async update(
    @Request() req: UserJwtPayload,
    @Body() payload: Partial<JournalDaySettingsModel>,
    @Param() params: KeyVals,
  ): Promise<JournalDaySettingsModel> {
    let journalEntryEntity = await this.journalDaySettingsService.findByUid(
      params.uid,
    );
    Util.validateExists(journalEntryEntity);
    Util.validateUserSelfUpdate(req.user.id, journalEntryEntity.userId);

    journalEntryEntity = await this.journalDaySettingsService.save(payload);
    return this.journalDaySettingsService.toModel(journalEntryEntity);
  }
}
