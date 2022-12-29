import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { Util } from '@shared';

import { BaseService } from '../base.service';
import { JournalEntryModel } from './journal-entry.model';
import { StoreService } from '../store.service';

@Injectable({
  providedIn: 'root',
})
export class JournalEntryService extends BaseService<JournalEntryModel> {
  constructor(public http: HttpClient, public store: StoreService) {
    super('journal-entries', http, store);
  }

  async getAverageMoodScoreForDay(date: Date): Promise<number> {
    try {
      const params = new HttpParams().set('date', JSON.stringify(date));
      const response = this.http.get<number>(
        `${this.baseUrl}/average-mood-score-for-day`,
        { params }
      );
      return lastValueFrom(response);
    } catch (error) {
      throw new Error(Util.parseError(error as HttpErrorResponse));
    }
  }
}
