import { FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { BaseController } from './base.controller';
import { BaseControllerService } from './base.controller.service';
import { GenericObject, LoadingOptions, NotifType } from '../types';
import { Logger } from '../logger';
import { Util } from '../util';

const logger = new Logger('FormController');

export abstract class FormController extends BaseController {
  isDisabled = false;
  isSubmitting = false;

  form: Form;

  protected constructor(public override baseService: BaseControllerService) {
    super(baseService);
  }

  /**
   * Sets isSubmitting while passed in code block runs
   * then notifies on resolve or reject. (See handleLoad())
   */
  handleSubmit(
    fn: Function,
    options: LoadingOptions = {},
    formOverwrite?: Form
  ) {
    this.isSubmitting = true;

    const form = this.form ?? formOverwrite;

    this.handleLoad(async () => {
      try {
        if (!form.valid) {
          form.showErrors = true;
          this.isSubmitting = false;
          return Promise.reject(this.messages.requiredFields);
        }

        await fn();
        this.isSubmitting = false;
      } catch (err) {
        this.isSubmitting = false;
        return Promise.reject(err);
      }
    }, options);
  }

  /** Preserves new lines from input content to send to DB */
  parseNewLinesString(content: string, reverse = false): string {
    return !reverse
      ? content.replace(/\n\r?/g, '\\n')
      : content.replace(/\\n/g, '\n');
  }
}

export class Form extends FormGroup {
  showErrors: boolean;

  /** Shows an error toast message for the form, then toggles showing validation messages above inputs. */
  notifyErrors(notificationService: MessageService) {
    Util.notify(
      notificationService,
      NotifType.Error,
      'Please fill out the required fields'
    );

    this.showErrors = true;
  }

  /** Parses form field values off of Form model. */
  getValues(): any {
    const formData: GenericObject = {};

    for (const key of Object.keys(this.controls)) {
      formData[key] = this.controls[key].value;
    }

    return formData;
  }
}
