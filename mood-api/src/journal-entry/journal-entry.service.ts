import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';

import * as sanitizeHtml from 'sanitize-html';

import { BaseService } from '../base.service';
import { JournalEntryEntity } from './journal-entry.entity';
import { JournalEntryModel } from './journal-entry.model';
import { QueryService } from '../query/query.service';

@Injectable()
export class JournalEntryService extends BaseService<JournalEntryEntity> {
  constructor(
    @InjectRepository(JournalEntryEntity)
    public journalEntryRepository: Repository<JournalEntryEntity>,

    @Inject(forwardRef(() => QueryService))
    public queryService: QueryService,
  ) {
    super(journalEntryRepository, queryService);
  }

  toModel(entity: JournalEntryEntity): JournalEntryModel {
    return plainToClass(JournalEntryModel, entity);
  }

  toModelArray(entities: JournalEntryEntity[]): JournalEntryModel[] {
    return entities.map((entity) => this.toModel(entity));
  }

  async validate(entity: JournalEntryEntity) {
    if (entity.entry) {
      entity.entry = sanitizeHtml(entity.entry, {
        allowedAttributes: {
          p: ['style', 'class'],
          span: ['style'],
          li: ['style'],
          strong: ['style'],
          u: ['style'],
          i: ['style'],
        },
      });
    }

    return entity;
  }

  async getAverageMoodScoreForDay(date: Date, userId: number): Promise<number> {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const journalEntries = (await this.findAll({
      filters: [
        {
          userId: userId,
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
}
