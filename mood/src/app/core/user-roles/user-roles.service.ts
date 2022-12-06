import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseService } from '../base.service';
import { UserRolesModel } from './user-roles.model';

@Injectable({
  providedIn: 'root',
})
export class UserRolesService extends BaseService<UserRolesModel> {
  constructor(public override http: HttpClient) {
    super('user-roles', http);
  }
}
