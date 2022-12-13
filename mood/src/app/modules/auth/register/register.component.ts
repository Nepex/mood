import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { AuthService, UserModel } from '@core';
import { FormController, BaseControllerService, Logger, Util } from '@shared';

import { registerForm } from './form';

const logger = new Logger('RegisterComponent');

@Component({
  selector: 'mood-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent extends FormController<
  Pick<UserModel, 'email' | 'password'>
> {
  constructor(
    public location: Location,
    public baseService: BaseControllerService,
    private readonly authService: AuthService
  ) {
    super(baseService);
    this.form = registerForm();
  }

  /** Validates user form, registers the new user, logs in, emits step completion. */
  async createUser() {
    this.handleSubmit(
      async () => {
        const { email, password } = this.form.getValues();

        await this.authService.register({ email, password });
        // await this.authService.login({ email, password });

        logger.success('User created! Logging in...');
        await this.sleep(Util.SOFT_DELAY);
      },
      {
        successMessage: 'Account created!',
      }
    );
  }
}
