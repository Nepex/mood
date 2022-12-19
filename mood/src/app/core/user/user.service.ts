import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseService } from '../base.service';
import { StoreService } from '../store.service';
import { UserModel } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<UserModel> {
  constructor(public http: HttpClient, public store: StoreService) {
    super('users', http, store);
  }
}
