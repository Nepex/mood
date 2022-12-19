import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseService } from '../base.service';
import { JournalDaySettingsModel } from './journal-day-settings.model';
import { StoreService } from '../store.service';

@Injectable({
  providedIn: 'root',
})
export class JournalDaySettingsService extends BaseService<JournalDaySettingsModel> {
  constructor(public override http: HttpClient, public store: StoreService) {
    super('journal-day-settings', http, store);
  }
}
