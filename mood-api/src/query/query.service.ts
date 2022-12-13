import { Injectable } from '@nestjs/common';

import {
  Any,
  Between,
  Equal,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Raw,
  Repository,
} from 'typeorm';

import { Logger } from '../util/logger';
import { FilterOpts, FilterQueryOpts } from '../util/types';

const logger = new Logger('QueryUtil');

// NOTE: 2 char lengths need to come first for enum loop to work
// and not pick the wrong 1 chars first
export enum QueryOperator {
  JoinUid = '>>', // will look in joined table by uid (example >>player: uid)
  Not = '!=',
  LessThanOrEqual = '<=',
  MoreThanOrEqual = '>=',
  Between = '><',
  InArray = '@>',
  NotIn = '!|',
  ILike = '%*',
  Like = '%',
  Any = '*',
  In = '|',
  IsNull = '!',
  Equal = '=',
  LessThan = '<',
  MoreThan = '>',
}

@Injectable()
export class QueryService {
  public decodeSearchQuery<ENTITY>(query: string): FilterQueryOpts<ENTITY> {
    const _query = JSON.parse(query);

    if (_query.limit) {
      _query.limit = +_query.limit;
    }

    if (_query.offset) {
      _query.offset = +_query.offset;
    }

    if (_query.sort) {
      _query.sort = _query.sort;
    }

    if (_query.filters) {
      _query.filters = _query.filters;
    } else {
      _query.filters = [];
    }

    return _query;
  }

  public async buildFindOptions<ENTITY>(
    query: Partial<FilterQueryOpts<ENTITY>>,
  ): Promise<FindManyOptions<ENTITY> | FindOneOptions<ENTITY>> {
    const options: any = {};

    if (query.filters) {
      options.where = await this.buildWhere<ENTITY>(query.filters);
    }

    if (query.sort && query.sort?.length) {
      const sortObj = {};

      for (const s of query.sort as any) {
        sortObj[s.field] = s.order;
      }

      options.order = sortObj;
    }

    if (query.offset) {
      options.skip = query.offset;
    }

    if (query.limit) {
      options.take = query.limit;
    }

    if (query.fields) {
      options.select = query.fields;
    }

    logger.info('buildFindOptions(), options', options);
    return options;
  }

  private async buildWhere<ENTITY>(
    filters: FilterOpts<ENTITY>,
  ): Promise<FindOptionsWhere<ENTITY>[]> {
    if (
      !filters ||
      (Array.isArray(filters) && !filters?.length) ||
      (typeof filters === 'object' && Object.keys(filters).length === 0)
    ) {
      return [];
    }

    const _filters = Array.isArray(filters) ? filters : [filters];

    const where = [];

    for (const filter of _filters) {
      where.push(await this.buildFindObject<ENTITY>(filter));
    }

    return where;
  }

  private async buildFindObject<ENTITY>(
    filter: FilterOpts<ENTITY>,
  ): Promise<FindOptionsWhere<ENTITY>> {
    const formattedFilter = {};

    for (const key of Object.keys(filter)) {
      if (typeof filter[key] === 'object' && !Array.isArray(filter[key])) {
        formattedFilter[key] = this.buildFindObject(filter[key]);
      } else {
        const operator = this.parseOperator(key);

        if (operator) {
          switch (operator) {
            case QueryOperator.Not:
              formattedFilter[key.slice(2)] = Not(filter[key]);
              break;
            case QueryOperator.LessThan:
              formattedFilter[key.slice(1)] = LessThan(filter[key]);
              break;
            case QueryOperator.LessThanOrEqual:
              formattedFilter[key.slice(2)] = LessThanOrEqual(filter[key]);
              break;
            case QueryOperator.MoreThan:
              formattedFilter[key.slice(1)] = MoreThan(filter[key]);
              break;
            case QueryOperator.MoreThanOrEqual:
              formattedFilter[key.slice(2)] = MoreThanOrEqual(filter[key]);
              break;
            case QueryOperator.Equal:
              formattedFilter[key.slice(1)] = Equal(filter[key]);
              break;
            case QueryOperator.Like:
              formattedFilter[key.slice(1)] = Like(`%${filter[key]}%`);
              break;
            case QueryOperator.ILike:
              formattedFilter[key.slice(2)] = ILike(`%${filter[key]}%`);
              break;
            case QueryOperator.Between:
              const fromTo = filter[key].split(',');
              formattedFilter[key.slice(2)] = Between(fromTo[0], fromTo[1]);
              break;
            case QueryOperator.In:
              formattedFilter[key.slice(1)] = In(filter[key]);
              break;
            case QueryOperator.NotIn:
              formattedFilter[key.slice(1)] = Not(In(filter[key]));
              break;
            case QueryOperator.InArray:
              const filterObj = {};
              filterObj[key.slice(2)] = filter[key];

              formattedFilter[key.slice(2)] = Raw(
                (alias) => `${alias} @> ARRAY[:...${key.slice(2)}]`,
                filterObj,
              );
              break;
            case QueryOperator.Any:
              formattedFilter[key.slice(2)] = Any(filter[key]);
              break;
            case QueryOperator.IsNull:
              formattedFilter[key.slice(1)] = IsNull();
              break;
            case QueryOperator.JoinUid:
              const table = key.slice(2);
              const id = await this.getDeepIdByUid(table, filter[key]);

              formattedFilter[`${table}Id`] = id;

              break;
          }
        } else {
          formattedFilter[key] = filter[key];
        }
      }
    }

    return formattedFilter;
  }

  private parseOperator(property: string): QueryOperator {
    const operatorKeys = Object.keys(QueryOperator);
    let found: QueryOperator;

    for (const operatorKey of operatorKeys) {
      if (property.includes(QueryOperator[operatorKey])) {
        found = QueryOperator[operatorKey];
        break;
      }
    }

    return found;
  }

  private async getDeepIdByUid(table: string, uid: string) {
    let entity: any;

    switch (table) {
    }

    return entity?.id;
  }

  private async findByUid(repo: Repository<any>, uid: string): Promise<any> {
    return await repo.findOne({
      where: {
        uid: uid,
      },
    });
  }
}
