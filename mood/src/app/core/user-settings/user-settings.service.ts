import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseService } from '../base.service';
import { UserSettings } from './user-settings.model';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService extends BaseService<UserSettings> {
  constructor(public http: HttpClient) {
    super('user-settings', http);
  }
}
