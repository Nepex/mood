import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { BaseControllerService } from './base.controller.service';
import { LoadingOptions, NotifType } from '../types';
import { Util } from '../util';

export abstract class BaseController {
  isLoading = false;
  uid: string | undefined;

  messages = {
    requiredFields: 'Please fill out the required fields.',
  };

  constructor(public baseService?: BaseControllerService) {}

  /** Sets isLoading while passed in code block runs, then notifies on resolve or reject. */
  handleLoad(fn: Function, options: LoadingOptions = {}) {
    this.toggleLoadingSpinner(true, options);

    fn()
      .then(() => {
        this.toggleLoadingSpinner(false, options);

        if (options?.successMessage && this.baseService) {
          Util.notify(
            this.baseService.notificationService,
            NotifType.Success,
            options.successMessage
          );
        }
      })
      .catch((err: HttpErrorResponse | string) => {
        this.toggleLoadingSpinner(false, options);

        if (!options?.suppressErrors && this.baseService) {
          Util.notify(
            this.baseService.notificationService,
            NotifType.Error,
            Util.parseError(err)
          );
        }
      });
  }

  /** Toggles input variables for loading spinners. */
  toggleLoadingSpinner(isLoading: boolean, options: LoadingOptions) {
    this.isLoading = isLoading;

    if (this.baseService && !options.disableLoadingEmits) {
      this.baseService.toggleLoading.emit(isLoading);
    }
  }

  /** Displays a toast notification. */
  notify(type: NotifType, message?: string, sticky?: boolean) {
    if (!this.baseService) return;

    return Util.notify(
      this.baseService.notificationService,
      type,
      message,
      sticky
    );
  }

  /** Parses slug to titlecase (test-string -> Test String). */
  slugToTitlecase(str: string): string {
    return Util.slugToTitlecase(str);
  }

  /** Capitalize first letter of string (hello there -> Hello there). */
  capitalizeFirst(str: string): string {
    return Util.capitalizeFirst(str);
  }

  /** Truncates string to limited amount of characters. */
  truncateString(text: string, maxLength: number): string {
    return Util.truncateString(text, maxLength);
  }

  /** Refreshes current page, in an 'Angular' way */
  async reloadPage(router: Router) {
    return await Util.reloadPage(router);
  }

  /** Returns a promise with simulated delay/loading */
  async sleep(ms: number): Promise<void> {
    return Util.sleep(ms);
  }

  /** Turns HTML into plaintext */
  stripHtml(str: string): string {
    return Util.stripHtml(str);
  }

  /** Called from component markup, emits on accepted */
  // confirmPopOver(event: Event, uid: string, message?: string) {
  //   this.baseService.confirmationService.confirm({
  //     target: event.target,
  //     message: message ?? 'Are you sure you want to do this?',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => this.baseService.popOverConfirmed.emit(uid),
  //   });
  // }

  /** Scroll browser to top */
  scrollToTop() {
    Util.scrollToTop();
  }

  /** Test if user has specified role */
  // hasRole(user: User, role: Role | any): boolean {
  //   if (!user) {
  //     return false;
  //   }

  //   return user.roles.indexOf(role) > -1;
  // }
}
