import { Component } from '@angular/core';

import { AuthService, Credentials } from '@core';
import { BaseControllerService, FormController, Logger, Util } from '@shared';
import { loginForm } from './form';

const logger = new Logger('LoginComponent');

@Component({
  selector: 'mood-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth-shared.scss'],
})
export class LoginComponent extends FormController<Credentials> {
  constructor(
    public baseService: BaseControllerService,
    private readonly authService: AuthService
  ) {
    super(baseService);
    this.form = loginForm();

    // If user is already logged in, redirect them
    if (this.authService.isAuthenticated()) {
      logger.warn('Session detected!');
      this.handleRedirect();
    }
  }

  /** Validates user credentials, creates new session if valid, then redirects. */
  async attemptLogin() {
    await this.handleSubmit(async () => {
      const { email, password } = this.form.getValues();
      await this.authService.login({ email, password });

      logger.success('User authenticated!');
      await this.sleep(Util.SOFT_DELAY);
      await this.handleRedirect();
    });
  }

  /** Redirects user to appropriate screen depending on current registration step saved. */
  async handleRedirect() {
    logger.info('Determining redirect...');
    const redirect = this.queryParams?.redirect;

    if (redirect) {
      return await this.baseService.router.navigate([redirect]);
    }

    await this.baseService.router.navigateByUrl('/');
  }
}
