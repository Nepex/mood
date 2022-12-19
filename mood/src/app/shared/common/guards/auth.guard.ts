import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AuthService, StoreService } from '@core';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly store: StoreService
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login'], {
        queryParams: {
          redirect: state.url,
        },
      });
      return false;
    }

    const { me } = await firstValueFrom(this.store.state$);
    if (!me) {
      await this.authService.me();
    }

    return true;
  }
}
