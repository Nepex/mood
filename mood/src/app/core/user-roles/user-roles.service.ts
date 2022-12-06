import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseService } from '../base.service';
import { UserRoles } from './user-roles.model';

@Injectable({
  providedIn: 'root',
})
export class UserRolesService extends BaseService<UserRoles> {
  constructor(public http: HttpClient) {
    super('user-roles', http);
  }
}
