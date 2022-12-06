import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

import { AuthService, Role } from '@core';

import { Util } from '../util';
import { NotifType } from '../types';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly notificationService: MessageService
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const expectedRole: Role = route.data.role;
    const user = await this.authService.me();

    if (user?.roles?.indexOf(expectedRole) < 0) {
      Util.notify(
        this.notificationService,
        NotifType.Error,
        'You do not have the proper privileges to view this page.'
      );
      return false;
    }

    return true;
  }
}
