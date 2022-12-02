import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';

import { BaseService } from '../base.service';
import { ENTITY } from '../util';
import { QueryService } from '../query/query.service';
import { User } from './user.entity';
import { UserModel } from './user.model';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    public userRepository: Repository<ENTITY<User>>,

    @Inject(forwardRef(() => QueryService))
    public queryService: QueryService,
  ) {
    super(userRepository, queryService);
  }

  async toModel(entity: User): Promise<UserModel> {
    let model = plainToClass(UserModel, entity);
    const userRoles = entity.userRolesId
      ? await this.userRolesService.findById(entity.userRolesId)
      : null;
    const userSettings = entity.userSettingsId
      ? await this.userSettingsService.findById(entity.userSettingsId)
      : null;

    model = new UserModel({
      ...model,
      roles: userRoles.roles,
      settings: this.userSettingsService.toModel(userSettings),
    });

    return model;
  }

  async toModelArray(entities: User[]): Promise<UserModel[]> {
    return await Promise.all(entities.map((entity) => this.toModel(entity)));
  }
}
