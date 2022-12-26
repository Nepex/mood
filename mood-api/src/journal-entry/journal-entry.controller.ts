import {
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import { FilterQueryOpts, KeyVals, Logger, PagedResponse, Util } from '../util';
import { JournalEntryEntity } from './journal-entry.entity';
import { JournalEntryModel } from './journal-entry.model';
import { JournalEntryService } from './journal-entry.service';
import { QueryService } from '../query/query.service';
import { UserGuard } from '../auth/guards/user.guard';
import { UserJwtPayload } from '../auth/util';

const logger = new Logger('JournalEntryController');

@UseGuards(UserGuard)
@Controller('journal-entries')
export class JournalEntryController {
  constructor(
    private readonly journalEntryService: JournalEntryService,

    @Inject(forwardRef(() => QueryService))
    public queryService: QueryService,
  ) {}

  @Get('search')
  async search(
    @Request() req: UserJwtPayload,
    @Query() query: { findQuery: FilterQueryOpts<JournalEntryModel> },
  ): Promise<PagedResponse<JournalEntryModel>> {
    const findQuery = this.queryService.decodeSearchQuery(
      query.findQuery as string,
    );

    findQuery.filters = findQuery.filters.map((filter) => {
      return { ...filter, userId: req.user.id };
    });

    const pagedEntities = await this.journalEntryService.search(findQuery);

    return {
      ...pagedEntities,
      data: this.journalEntryService.toModelArray(pagedEntities.data),
    };
  }

  @Post()
  async create(
    @Request() req: UserJwtPayload,
    @Body() payload: Partial<JournalEntryModel>,
  ): Promise<JournalEntryModel> {
    const journalEntryEntity = new JournalEntryEntity({
      ...payload,
      userId: req.user.id,
    });

    await this.journalEntryService.save(journalEntryEntity);
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
