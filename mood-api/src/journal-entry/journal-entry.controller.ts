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
import * as dayjs from 'dayjs';

import {
  FilterOpts,
  FilterQueryOpts,
  KeyVals,
  Logger,
  PagedResponse,
  Util,
} from '../util';
import { DayTrendData } from './journal-entry.types';
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
    return await this.journalEntryService.getAverageMoodScoreForDay(
      date,
      req.user.id,
    );
  }

  @Get('trend-data-for-month')
  async getTrendDataForMonth(
    @Request() req: UserJwtPayload,
    @Query() query: { date: string },
  ): Promise<DayTrendData[]> {
    const date = new Date(JSON.parse(query.date));
    const monthTrendData: DayTrendData[] = [];

    // get scores for each day in parallel
    const daysInMonth = dayjs(dayjs(date)).daysInMonth();
    await Promise.all(
      [...Array(daysInMonth).keys()].map(async (val: any, i: number) => {
        const dayDate = new Date(
          dayjs(date)
            .date(i + 1)
            .format('MM-DD-YYYY'),
        );

        const score = await this.journalEntryService.getAverageMoodScoreForDay(
          dayDate,
          req.user.id,
        );

        monthTrendData.push({
          dayNumber: i + 1,
          score: score ?? 0,
          dateString: dayjs(dayDate).date(i).toISOString(),
        });
      }),
    );

    // make sure to sort by day number before sending back
    return monthTrendData.sort((a, b) => a.dayNumber - b.dayNumber);
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
