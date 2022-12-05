import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';

import { BaseService } from '../base.service';
import { QueryService } from '../query/query.service';
import { JournalDaySettingsEntity } from './journal-day-settings.entity';
import { JournalDaySettingsModel } from './journal-day-settings.model';

@Injectable()
export class JournalDaySettingsService extends BaseService<JournalDaySettingsEntity> {
  constructor(
    @InjectRepository(JournalDaySettingsEntity)
    public journalDaySettingsRepository: Repository<JournalDaySettingsEntity>,

    @Inject(forwardRef(() => QueryService))
    public queryService: QueryService,
  ) {
    super(journalDaySettingsRepository, queryService);
  }

  toModel(entity: JournalDaySettingsEntity): JournalDaySettingsModel {
    return plainToClass(JournalDaySettingsModel, entity);
  }

  toModelArray(
    entities: JournalDaySettingsEntity[],
  ): JournalDaySettingsModel[] {
    return entities.map((entity) => this.toModel(entity));
  }

  async validate(entity: JournalDaySettingsEntity) {
    return entity;
  }
}
