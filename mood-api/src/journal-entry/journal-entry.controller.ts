import {
  Body,
  Controller,
  Delete,
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

import {
  FilterOpts,
  FilterQueryOpts,
  KeyVals,
  Logger,
  PagedResponse,
  Util,
} from '../util';
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

  @Get('find-one')
  async findOne(
    @Query() query: { filters: FilterOpts<JournalEntryModel> },
  ): Promise<JournalEntryModel> {
    const filters = JSON.parse(query.filters as string);
    const journalEntry = await this.journalEntryService.findOne(filters);
    return this.journalEntryService.toModel(journalEntry);
  }

  @Get('average-mood-score-for-day')
  async getAverageMoodScoreForDay(
    @Request() req: UserJwtPayload,
    @Query() query: { date: string },
  ): Promise<number> {
    const date = new Date(JSON.parse(query.date));
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const journalEntries = (await this.journalEntryService.findAll({
      filters: [
        {
          userId: req.user.id,
          '><entryAt': `${startOfDay.toISOString()},${endOfDay.toISOString()}`,
        },
      ],
      fields: ['score'],
    })) as JournalEntryEntity[];

    const scores = journalEntries.map((entry) => entry.score);
    const averageScore = scores.reduce(
      (prev, next) => prev + next / scores.length,
      0,
    );

    return +averageScore.toFixed(1);
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

  @Delete(':uid')
  async remove(
    @Request() req: UserJwtPayload,
    @Param() params: { uid: string },
  ) {
    const journalEntryEntity = await this.journalEntryService.findByUid(
      params.uid,
    );

    Util.validateExists(journalEntryEntity);
    Util.validateUserSelfUpdate(req.user.id, journalEntryEntity.userId);
    await this.journalEntryService.removeById(journalEntryEntity.id);
  }
}
