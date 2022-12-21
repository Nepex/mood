import { FormControl, Validators } from '@angular/forms';

import { Credentials } from '@core';
import { Form, Util } from '@shared';

export const loginForm = (): Form<Credentials> => {
  return new Form<Credentials>({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(Util.EMAIL_REGEX),
    ]),
    password: new FormControl('', [Validators.required]),
  });
};
