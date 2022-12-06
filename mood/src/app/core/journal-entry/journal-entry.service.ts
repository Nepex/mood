import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseService } from '../base.service';
import { JournalEntryModel } from './journal-entry.model';

@Injectable({
  providedIn: 'root',
})
export class JournalEntryService extends BaseService<JournalEntryModel> {
  constructor(public override http: HttpClient) {
    super('journal-entries', http);
  }
}
