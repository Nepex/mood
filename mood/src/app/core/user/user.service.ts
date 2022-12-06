import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseService } from '../base.service';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<User> {
  constructor(public http: HttpClient) {
    super('user', http);
  }
}
