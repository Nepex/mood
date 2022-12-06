import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseService } from '../base.service';
import { JournalDaySettingsModel } from './journal-day-settings.model';

@Injectable({
  providedIn: 'root',
})
export class JournalDaySettingsService extends BaseService<JournalDaySettingsModel> {
  constructor(public override http: HttpClient) {
    super('journal-day-settings', http);
  }
}
