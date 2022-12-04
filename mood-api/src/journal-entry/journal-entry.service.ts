import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';

import { BaseService } from '../base.service';
import { JournalEntryEntity } from './journal-entry.entity';
import { JournalEntryModel } from './journal-entry.model';
import { QueryService } from '../query/query.service';

@Injectable()
export class JournalEntryService extends BaseService<JournalEntryEntity> {
  constructor(
    @InjectRepository(JournalEntryEntity)
    public userSettingsRepository: Repository<JournalEntryEntity>,

    @Inject(forwardRef(() => QueryService))
    public queryService: QueryService,
  ) {
    super(userSettingsRepository, queryService);
  }

  toModel(entity: JournalEntryEntity): JournalEntryModel {
    return plainToClass(JournalEntryModel, entity);
  }

  toModelArray(entities: JournalEntryEntity[]): JournalEntryModel[] {
    return entities.map((entity) => this.toModel(entity));
  }

  async validate(entity: JournalEntryEntity) {
    return entity;
  }
}
