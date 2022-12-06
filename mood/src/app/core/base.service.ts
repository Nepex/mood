import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { environment } from '@env';
import {
  FilterOpts,
  FilterQueryOpts,
  Logger,
  PagedResponse,
  Util,
} from '@shared';

import { BaseModel } from './base.model';

const logger = new Logger('BaseService');

export enum QueryOperator {
  JoinUid = '>>', // will look in joined table by uid (example >>player.uid)
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

export abstract class BaseService<MODEL extends { uid?: string } = any> {
  baseUrl: string;
  headers = new HttpHeaders();

  constructor(public endpoint: string, public http: HttpClient) {
    this.baseUrl = `${environment.apiBaseUrl}/${endpoint}`;
    this.headers.append('Content-Type', 'application/json');
  }

  /** Gets an array of records by filters/sort/limit/offset. */
  async search(query: FilterQueryOpts<MODEL>): Promise<PagedResponse<MODEL>> {
    try {
      const params = new HttpParams().set('findQuery', JSON.stringify(query));

      const response = this.http.get<PagedResponse<MODEL>>(
        `${this.baseUrl}/search`,
        {
          params,
        }
      );
      return lastValueFrom(response);
    } catch (err) {
      throw new Error(Util.errorToString(err as HttpErrorResponse));
    }
  }

  /** Gets an array of all records for that MODEL. */
  async findAll(query: FilterQueryOpts<MODEL>): Promise<MODEL[]> {
    try {
      const params = new HttpParams().set('findQuery', JSON.stringify(query));

      const response = this.http.get<MODEL[]>(`${this.baseUrl}`, {
        params,
      });
      return lastValueFrom(response);
    } catch (err) {
      throw new Error(Util.errorToString(err as HttpErrorResponse));
    }
  }

  /** Uses findAll, but only returns a number count. */
  async count(filters: FilterOpts<MODEL>): Promise<number> {
    const query: FilterQueryOpts<MODEL> = {
      filters,
      countOnly: true,
    };

    return (await this.findAll(query)) as any | number;
  }

  /** Gets a record by filters. */
  async findOne(filters: FilterOpts<MODEL>): Promise<MODEL> {
    try {
      const params = new HttpParams().set('filters', JSON.stringify(filters));
      const response = this.http.get<MODEL>(`${this.baseUrl}/find-one`, {
        params,
      });
      return lastValueFrom(response);
    } catch (err) {
      throw new Error(Util.errorToString(err as HttpErrorResponse));
    }
  }

  /** Gets a record by UID. */
  async findByUid(uid: string): Promise<MODEL> {
    return await this.findOne({ uid } as MODEL);
  }

  /** Creates a record, or if a uid is present - updates the record. */
  async save(model: Partial<MODEL>): Promise<MODEL> {
    if (model.uid) {
      return await this.update(model);
    }

    try {
      const response = this.http.post<MODEL>(`${this.baseUrl}`, model);
      return lastValueFrom(response);
    } catch (err) {
      throw new Error(Util.errorToString(err as HttpErrorResponse));
    }
  }

  /** Updates a record. */
  async update(model: Partial<MODEL>): Promise<MODEL> {
    try {
      const response = this.http.put<MODEL>(
        `${this.baseUrl}/${model.uid}`,
        model
      );
      return lastValueFrom(response);
    } catch (err) {
      throw new Error(Util.errorToString(err as HttpErrorResponse));
    }
  }

  /** Deletes a record. */
  async remove(model: Partial<MODEL>) {
    try {
      return await this.removeByUid(model.uid as string);
    } catch (err) {
      throw new Error(Util.errorToString(err as HttpErrorResponse));
    }
  }

  /** Deletes a record by UID. */
  async removeByUid(uid: string) {
    try {
      const response = this.http.delete<MODEL>(`${this.baseUrl}/${uid}`);
      return lastValueFrom(response);
    } catch (err) {
      throw new Error(Util.errorToString(err as HttpErrorResponse));
    }
  }

  /**
   * Get properties associated with current user.
   */
  async mine(): Promise<MODEL> {
    try {
      const response = this.http.get<MODEL>(`${this.baseUrl}/mine`);
      return lastValueFrom(response);
    } catch (err) {
      throw new Error(Util.errorToString(err as HttpErrorResponse));
    }
  }

  /** Gets array of property associated with current used. */
  async allOfMine(): Promise<MODEL[]> {
    try {
      const response = this.http.get<MODEL[]>(`${this.baseUrl}/all-of-mine`);
      return lastValueFrom(response);
    } catch (err) {
      throw new Error(Util.errorToString(err as HttpErrorResponse));
    }
  }
}
