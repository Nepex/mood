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
    console.log(entity);

    if (entity.entry) {
      entity.entry = sanitizeHtml(entity.entry);
    }

    return entity;
  }
}
