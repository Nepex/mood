import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { BaseService } from '../base.service';
import { QueryService } from '../query/query.service';
import { UserRolesEntity } from './user-roles.entity';
import { UserRolesModel } from './user-roles.model';

@Injectable()
export class UserRolesService extends BaseService<UserRolesEntity> {
  constructor(
    @InjectRepository(UserRolesEntity)
    public userRolesRepository: Repository<UserRolesEntity>,

    @Inject(forwardRef(() => QueryService))
    public queryService: QueryService,
  ) {
    super(userRolesRepository, queryService);
  }

  toModel(entity: UserRolesEntity): UserRolesModel {
    return plainToInstance(UserRolesModel, entity);
  }

  toModelArray(entities: UserRolesEntity[]): UserRolesModel[] {
    return entities.map((entity) => this.toModel(entity));
  }

  async validate(entity: UserRolesEntity) {
    return entity;
  }
}
