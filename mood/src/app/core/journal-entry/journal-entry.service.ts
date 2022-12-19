import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
}
