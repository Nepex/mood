import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { BaseService } from '../base.service';
import { QueryService } from '../query/query.service';
import { UserEntity } from './user.entity';
import { UserModel } from './user.model';
import { UserRolesService } from '../user-roles/user-roles.service';
import { UserSettingsService } from '../user-settings/user-settings.service';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    public userRepository: Repository<UserEntity>,

    @Inject(forwardRef(() => UserRolesService))
    public userRolesService: UserRolesService,

    @Inject(forwardRef(() => UserSettingsService))
    public userSettingsService: UserSettingsService,

    @Inject(forwardRef(() => QueryService))
    public queryService: QueryService,
  ) {
    super(userRepository, queryService);
  }

  async toModel(entity: UserEntity): Promise<UserModel> {
    let model = plainToInstance(UserModel, entity);
    let { roles } = await this.userRolesService.findOne({
      userId: entity.id,
    });
    const userSettings = await this.userSettingsService.findOne({
      userId: entity.id,
    });

    roles = (<any>roles).replace('{', '').replace('}', '').split(',');

    model = new UserModel({
      ...model,
      roles,
      settings: this.userSettingsService.toModel(userSettings),
    });

    return model;
  }

  async toModelArray(entities: UserEntity[]): Promise<UserModel[]> {
    return await Promise.all(entities.map((entity) => this.toModel(entity)));
  }

  async validate(entity: UserEntity) {
    return entity;
  }
}
