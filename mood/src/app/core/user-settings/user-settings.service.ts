import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseService } from '../base.service';
import { StoreService } from '../store.service';
import { UserSettingsModel } from './user-settings.model';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService extends BaseService<UserSettingsModel> {
  constructor(public http: HttpClient, public store: StoreService) {
    super('user-settings', http, store);
  }
}
