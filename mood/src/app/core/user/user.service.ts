import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseService } from '../base.service';
import { UserModel } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<UserModel> {
  constructor(public override http: HttpClient) {
    super('users', http);
  }
}
