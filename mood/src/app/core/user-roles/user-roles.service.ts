import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseService } from '../base.service';
import { StoreService } from '../store.service';
import { UserRolesModel } from './user-roles.model';

@Injectable({
  providedIn: 'root',
})
export class UserRolesService extends BaseService<UserRolesModel> {
  constructor(public http: HttpClient, public store: StoreService) {
    super('user-roles', http, store);
  }
}
