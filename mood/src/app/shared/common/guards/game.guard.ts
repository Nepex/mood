import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Injectable } from '@angular/core';

import { AuthService, RegistrationStep } from '@core';

@Injectable({
  providedIn: 'root',
})
export class GameGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  /** Redirects non-registered or incomplete registration users to New Game */
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if (this.authService.isAuthenticated()) {
      const user = await this.authService.me();

      if (user.registrationStep !== RegistrationStep.AppearanceSaved) {
        this.router.navigate(['/new-game']);
        return false;
      }

      return true;
    }

    this.router.navigate(['/new-game']);
    return false;
  }
}
