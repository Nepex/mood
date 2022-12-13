import { FormControl, Validators } from '@angular/forms';

import { Form, Util } from '@shared';

export const registerForm = (): Form => {
  const form = new Form({
    email: new FormControl('', [
      Validators.required,
      Validators.maxLength(60),
      Validators.pattern(Util.EMAIL_REGEX),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(255),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(255),
      Util.matchValidator('password'),
    ]),
  });

  form.controls.password.valueChanges.subscribe(() => {
    form.controls.confirmPassword.updateValueAndValidity();
  });

  return form;
};
