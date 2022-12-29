import { HttpErrorResponse } from '@angular/common/http';
import { Params, Router } from '@angular/router';

import { AppStateKey } from '@core';
import { BaseControllerService } from './base.controller.service';
import { LayoutState, LoadingOptions, NotifType } from '../types';
import { Logger } from '../logger';
import { Util } from '../util';

const logger = new Logger('BaseController');

export abstract class BaseController {
  isLoading = false;
  queryParams: Params | undefined;
  uid: string | undefined;

  messages = {
    requiredFields: 'Please fill out the required fields.',
  };

  constructor(public baseService?: BaseControllerService) {
    this.queryParams =
      this.baseService?.route?.snapshot?.queryParams ?? undefined;
  }

  /** Sets isLoading while passed in code block runs, then notifies on resolve or reject. */
  async handleLoad(fn: Function, options: LoadingOptions = {}) {
    await this.toggleLoadingSpinner(true, options);

    await fn()
      .then(async () => {
        await this.toggleLoadingSpinner(false, options);

        if (options?.successMessage && this.baseService) {
          Util.notify(
            this.baseService.notificationService,
            NotifType.Success,
            options.successMessage
          );
        }
      })
      .catch(async (err: HttpErrorResponse | string) => {
        await this.toggleLoadingSpinner(false, options);

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
  async toggleLoadingSpinner(isLoading: boolean, options: LoadingOptions) {
    if (this.baseService && !options.disableGlobalLoad) {
      const { loadingProcesses } = await this.baseService.store.get(
        AppStateKey.Layout
      );

      this.baseService.store.set(AppStateKey.Layout, <LayoutState>{
        loadingProcesses: isLoading
          ? loadingProcesses + 1
          : loadingProcesses - 1,
      });
    }

    this.isLoading = isLoading;
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

  /** Scroll browser to bottom */
  scrollToBottom() {
    Util.scrollToBottom();
  }

  /** Test if user has specified role */
  // hasRole(user: User, role: Role | any): boolean {
  //   if (!user) {
  //     return false;
  //   }

  //   return user.roles.indexOf(role) > -1;
  // }
}
