import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JournalEntryModel } from './journal-entry.model';
import { JournalEntryService } from './journal-entry.service';
import { KeyVals, Logger, Util } from '../util';
import { UserGuard } from '../auth/guards/user.guard';
import { UserJwtPayload } from '../auth/util';

const logger = new Logger('JournalEntryController');

@UseGuards(UserGuard)
@Controller('journal-entries')
export class JournalEntryController {
  constructor(private readonly journalEntryService: JournalEntryService) {}

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
    @Body() payload: Partial<JournalEntryModel>,
  ): Promise<JournalEntryModel> {
    const journalEntryEntity = await this.journalEntryService.save(payload);
    return this.journalEntryService.toModel(journalEntryEntity);
  }

  @Put(':uid')
  async update(
    @Request() req: UserJwtPayload,
    @Body() payload: Partial<JournalEntryModel>,
    @Param() params: KeyVals,
  ): Promise<JournalEntryModel> {
    let journalEntryEntity = await this.journalEntryService.findByUid(
      params.uid,
    );
    Util.validateExists(journalEntryEntity);
    Util.validateUserSelfUpdate(req.user.id, journalEntryEntity.userId);

    journalEntryEntity = await this.journalEntryService.save(payload);
    return this.journalEntryService.toModel(journalEntryEntity);
  }
}
