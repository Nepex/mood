import { Injectable } from '@nestjs/common';

import { FindOneOptions, Repository } from 'typeorm';
import { uid } from 'uid';

import { QueryService } from './query/query.service';
import {
  FilterOpts,
  FilterQueryOpts,
  Logger,
  PagedResponse,
  TypeUtil,
  Util,
} from './util';

const logger = new Logger('BaseService');

export type Base<T> = T & {
  id: number;
  uid: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export abstract class BaseService<ENTITY> {
  entityName = new TypeUtil<ENTITY>({} as ENTITY).getGenericName();

  constructor(
    private readonly repo: Repository<ENTITY>,
    public queryService: QueryService,
  ) {}

  // Returns a paged response of target entity matching provided filters
  async search(
    query: FilterQueryOpts<ENTITY> | string,
  ): Promise<PagedResponse<ENTITY>> {
    logger.info(`[search(): Executing ${this.entityName} search query]`, query);

    // decode query if coming from query string params
    if (typeof query === 'string') {
      query = this.queryService.decodeSearchQuery<ENTITY>(query);
    }

    // format filters, execute query, return result
    const findOptions = await this.queryService.buildFindOptions<ENTITY>(query);
    const [data, totalItems] = await this.repo.findAndCount(findOptions);

    logger.info(`[search(): Found ${data.length} ${this.entityName} records]`);

    return {
      data,
      totalItems,
      pageSize: query.limit,
      totalPages: Math.ceil(totalItems / query.limit),
      currentPage: Math.floor(query.offset / query.limit),
    };
  }

  // Returns an array of target entity matching provided filters
  async findAll(
    query: FilterQueryOpts<ENTITY> | string,
  ): Promise<ENTITY[] | number> {
    logger.info(
      `[findAll(): Executing ${this.entityName} findAll query]`,
      query,
    );

    // decode query if coming from query string params
    if (typeof query === 'string') {
      query = this.queryService.decodeSearchQuery<ENTITY>(query);
    }

    // build filters, execute query, return result
    const findOptions = await this.queryService.buildFindOptions<ENTITY>(query);
    let res: ENTITY[] | number;

    if (query.countOnly) {
      res = await this.repo.count(findOptions);
    }
    res = await this.repo.find(findOptions);

    logger.info(
      `[findAll(): Found ${res?.length ?? res} ${this.entityName} records]`,
    );

    return res;
  }

  // Returns a number / count of target entity matching provided filters
  async count(filters: FilterOpts<ENTITY>): Promise<number> {
    // execute query, return result
    return (await this.findAll({ filters, countOnly: true })) as number;
  }

  // Returns a single record of target entity matching provided filters
  async findOne(filters: FilterOpts<ENTITY>): Promise<ENTITY> {
    // build filters, execute query, return result
    const findOptions = await this.queryService.buildFindOptions<ENTITY>({
      filters,
    });
    const res = await this.repo.findOne(findOptions);

    logger.info(`[findOne(): Found ${this.entityName} record]`, res);

    return res;
  }

  // Returns a single record of target entity by id
  async findById(id: number): Promise<ENTITY> {
    const res = await this.repo.findOne({
      where: { id: id } as ENTITY,
    } as FindOneOptions<ENTITY>);

    logger.info(`[findById(): Found ${this.entityName} record]`, res);

    return res;
  }

  // Returns a single record of target entity by uid
  async findByUid(uid: string): Promise<ENTITY> {
    const res = await this.repo.findOne({
      where: {
        uid: uid,
      } as ENTITY,
    } as FindOneOptions<ENTITY>);

    logger.info(`[findByUid(): Found ${this.entityName} record]`, res);

    return res;
  }

  async save(entity: Partial<ENTITY>): Promise<ENTITY> {
    let entityToSave: ENTITY;

    // validate
    entity = await this.validate(entity as ENTITY);

    if (Util.isNewEntity(entity)) {
      // if this is a new entity, attach a generated uid
      entityToSave = { uid: uid(32), ...entity } as ENTITY;
    } else {
      // if we're updating an entity, find by full entity id or uid
      if ((<Base<ENTITY>>entity).id) {
        entityToSave = await this.repo.findOne({
          where: { id: (<Base<ENTITY>>entity).id } as ENTITY,
        } as FindOneOptions<ENTITY>);
      } else {
        entityToSave = await this.repo.findOne({
          where: { uid: (<Base<ENTITY>>entity).uid } as ENTITY,
        } as FindOneOptions<ENTITY>);
      }

      // tag 'updatedAt' with a current timestamp
      if ((<Base<ENTITY>>entityToSave).updatedAt) {
        (<Base<ENTITY>>entityToSave).updatedAt = new Date();
      }

      // merge in the provided update
      entityToSave = { ...entityToSave, ...entity };
    }

    // save the update, then return the updated entity
    const savedEntity = await this.repo.save(entityToSave);

    logger.info(
      `[save(): Successfully saved ${this.entityName} record!]`,
      savedEntity,
    );

    return savedEntity;
  }

  // Deletes a single record of target entity
  async remove(entity: ENTITY) {
    // execute query
    await this.repo.remove(entity);

    logger.info(
      `[save(): Successfully deleted ${this.entityName} record! ID: ]`,
      (<Base<ENTITY>>entity).id,
    );
  }

  // Deletes a single record of target entity by id
  async removeById(id: number) {
    const entity = await this.repo.findOne({
      where: { id } as ENTITY,
    } as FindOneOptions<ENTITY>);
    await this.remove(entity);
  }

  // Deletes a single record of target entity by uid
  async removeByUid(uid: string) {
    const entity = await this.repo.findOne({
      where: {
        uid: uid,
      } as ENTITY,
    } as FindOneOptions<ENTITY>);

    await this.remove(entity);
  }

  // Runs additional validation on target entity
  async validate(entity: Partial<ENTITY>) {
    return entity;
  }
}
