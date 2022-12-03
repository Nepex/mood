import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';

import { BaseService } from '../base.service';
import { QueryService } from '../query/query.service';
import { UserSettingsEntity } from './user-settings.entity';
import { UserSettingsModel } from './user-settings.model';

@Injectable()
export class UserSettingsService extends BaseService<UserSettingsEntity> {
  constructor(
    @InjectRepository(UserSettingsEntity)
    public userSettingsRepository: Repository<UserSettingsEntity>,

    @Inject(forwardRef(() => QueryService))
    public queryService: QueryService,
  ) {
    super(userSettingsRepository, queryService);
  }

  toModel(entity: UserSettingsEntity): UserSettingsModel {
    return plainToClass(UserSettingsModel, entity);
  }

  toModelArray(entities: UserSettingsEntity[]): UserSettingsModel[] {
    return entities.map((entity) => this.toModel(entity));
  }
}
