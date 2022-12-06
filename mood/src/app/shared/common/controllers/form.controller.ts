import { LoadingOptions } from '../types';

import { BaseController } from './base.controller';
import { BaseControllerService } from './base.controller.service';
import { Logger } from '../logger';

const logger = new Logger('FormController');

export abstract class FormController<MODEL = any> extends BaseController {
  isDisabled = false;
  isSubmitting = false;

  form: Form<MODEL>;

  protected constructor(public baseService: BaseControllerService) {
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
