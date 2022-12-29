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
import { AppStateKey, StoreService } from './store.service';

const logger = new Logger('BaseService');

export abstract class BaseService<MODEL extends { uid?: string } = any> {
  baseUrl: string;
  headers = new HttpHeaders();

  constructor(
    public endpoint: string,
    public http: HttpClient,
    public store: StoreService
  ) {
    this.baseUrl = `${environment.apiBaseUrl}/${endpoint}`;
    this.headers.append('Content-Type', 'application/json');
  }

  /** Gets an array of records by filters/sort/limit/offset. */
  async search(
    query: FilterQueryOpts<MODEL>,
    stateProp?: AppStateKey
  ): Promise<PagedResponse<MODEL>> {
    const params = new HttpParams().set('findQuery', JSON.stringify(query));

    const call = this.http.get<PagedResponse<MODEL>>(`${this.baseUrl}/search`, {
      params,
    });

    try {
      const result = await lastValueFrom(call);

      if (stateProp) {
        this.store.set(stateProp, result.data);
      }

      return result;
    } catch (error) {
      throw new Error(Util.parseError(error as HttpErrorResponse));
    }
  }

  /** Gets an array of all records for that MODEL. */
  async findAll(
    query: FilterQueryOpts<MODEL>,
    stateProp?: AppStateKey
  ): Promise<MODEL[]> {
    const params = new HttpParams().set('findQuery', JSON.stringify(query));
    const call = this.http.get<MODEL[]>(`${this.baseUrl}`, {
      params,
    });

    try {
      const result = await lastValueFrom(call);

      if (stateProp) {
        this.store.set(stateProp, result);
      }

      return result;
    } catch (error) {
      throw new Error(Util.parseError(error as HttpErrorResponse));
    }
  }

  /** Uses findAll, but only returns a number count. */
  async count(
    filters: FilterOpts<MODEL>[],
    stateProp?: AppStateKey
  ): Promise<number> {
    const query: FilterQueryOpts<MODEL> = {
      filters,
      countOnly: true,
    };

    return (await this.findAll(query, stateProp)) as any | number;
  }

  /** Gets a record by filters. */
  async findOne(
    filters: FilterOpts<MODEL>[],
    stateProp?: AppStateKey
  ): Promise<MODEL> {
    const params = new HttpParams().set('filters', JSON.stringify(filters));
    const call = this.http.get<MODEL>(`${this.baseUrl}/find-one`, {
      params,
    });

    try {
      const result = await lastValueFrom(call);

      if (stateProp) {
        this.store.set(stateProp, result);
      }

      return result;
    } catch (error) {
      throw new Error(Util.parseError(error as HttpErrorResponse));
    }
  }

  /** Gets a record by UID. */
  async findByUid(uid: string, stateProp?: AppStateKey): Promise<MODEL> {
    return await this.findOne([{ uid } as MODEL], stateProp);
  }

  /** Creates a record, or if a uid is present - updates the record. */
  async save(model: Partial<MODEL>, stateProp?: AppStateKey): Promise<MODEL> {
    if (model.uid) {
      return await this.update(model, stateProp);
    }

    const call = this.http.post<MODEL>(`${this.baseUrl}`, model);

    try {
      const result = await lastValueFrom(call);

      if (stateProp) {
        this.store.set(stateProp, result);
      }

      return result;
    } catch (error) {
      throw new Error(Util.parseError(error as HttpErrorResponse));
    }
  }

  /** Updates a record. */
  async update(model: Partial<MODEL>, stateProp?: AppStateKey): Promise<MODEL> {
    const call = this.http.put<MODEL>(`${this.baseUrl}/${model.uid}`, model);

    try {
      const result = await lastValueFrom(call);

      if (stateProp) {
        this.store.set(stateProp, result);
      }

      return result;
    } catch (error) {
      throw new Error(Util.parseError(error as HttpErrorResponse));
    }
  }

  /** Deletes a record. */
  async remove(model: Partial<MODEL>, stateProp?: AppStateKey) {
    return await this.removeByUid(model.uid as string, stateProp).catch((e) => {
      throw new Error(Util.parseError(e as HttpErrorResponse));
    });
  }

  /** Deletes a record by UID. */
  async removeByUid(uid: string, stateProp?: AppStateKey) {
    const call = this.http.delete<MODEL>(`${this.baseUrl}/${uid}`);

    try {
      const result = await lastValueFrom(call);

      if (stateProp) {
        this.store.remove(stateProp);
      }

      return result;
    } catch (error) {
      throw new Error(Util.parseError(error as HttpErrorResponse));
    }
  }

  /**
   * Get properties associated with current user.
   */
  async mine(stateProp?: AppStateKey): Promise<MODEL> {
    const call = this.http.get<MODEL>(`${this.baseUrl}/mine`);

    try {
      const result = await lastValueFrom(call);

      if (stateProp) {
        this.store.set(stateProp, result);
      }

      return result;
    } catch (error) {
      throw new Error(Util.parseError(error as HttpErrorResponse));
    }
  }

  /** Gets array of property associated with current used. */
  async allOfMine(stateProp?: AppStateKey): Promise<MODEL[]> {
    const call = this.http.get<MODEL[]>(`${this.baseUrl}/all-of-mine`);

    try {
      const result = await lastValueFrom(call);

      if (stateProp) {
        this.store.set(stateProp, result);
      }

      return result;
    } catch (error) {
      throw new Error(Util.parseError(error as HttpErrorResponse));
    }
  }
}
