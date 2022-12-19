import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { NotifType } from './types';
export const { version: appVersion } = require('../../../../package.json');

/** General Helpers and Parsers */

export class Util {
  /** Global Variables */
  // Timings
  static ERROR_DURATION = 4000;
  static SUCCESS_DURATION = 3000;
  static SOFT_DELAY = 250;
  static HARD_DELAY = 1000;

  // Regexes
  static EMAIL_REGEX: RegExp = /^[^@]+@[^@]+\.[^@]+$/;
  static NAME_REGEX: RegExp = /^[a-zA-Z0-9]*$/;

  /** Displays a toast notification. */
  static notify(
    notificationService: MessageService,
    type: NotifType,
    message?: string,
    sticky?: boolean
  ): void {
    const duration =
      type === NotifType.Error ? Util.ERROR_DURATION : Util.SUCCESS_DURATION;
    let msg: string;

    if (!message) {
      msg = type === NotifType.Error ? 'An error occurred' : 'Success!';
    } else {
      msg = message;
    }

    notificationService.add({
      severity: type,
      summary: Util.capitalizeFirst(type),
      detail: msg,
      life: duration,
      sticky: sticky ? sticky : false,
    });
  }

  /** Refreshes current page, in an 'Angular' way */
  static async reloadPage(router: Router) {
    const currentUrl = router.url;
    await router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      router.navigate([currentUrl]);
    });
  }

  /** Capitalize first letter of string (hello there -> Hello there). */
  static capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /** Parses slug to titlecase (test-string -> Test String). */
  static slugToTitlecase(str: string): string {
    if (!str || !str.length) {
      return '';
    }

    return str
      .split('-')
      .join(' ')
      .split(' ')
      .map((s: string): string =>
        s.replace(/^\w/, (c: string): string => c.toUpperCase())
      )
      .join(' ');
  }

  /** Parses a string error from an HttpErrorReponse */
  static parseError(err: HttpErrorResponse | string): string {
    return typeof err === 'string'
      ? err
      : err?.error?.message
      ? err.error.message
      : 'Server error - Please check back later';
  }

  /** Truncates string to limited amount of characters. */
  static truncateString(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substr(0, maxLength) + '...' : text;
  }

  /** Returns a promise with simulated delay/loading */
  static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /** Turns HTML into plaintext */
  static stripHtml(str: string): string {
    return str.replace(/<[^>]+>/g, '');
  }

  /** Scroll browser to top */
  static scrollToTop() {
    window.scrollTo(0, 0);
  }

  /** Custom form validator for checking if control values match each other. */
  static matchValidator(
    matchTo: string // name of the control to match to
  ): (arg: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent &&
        !!control.parent.value &&
        control.value === (<any>control).parent.controls[matchTo].value
        ? null
        : { isntMatch: matchTo };
    };
  }

  /** NG Animations */
  static getAni(
    animationSlug: string,
    optionalStyle?: string
  ): AnimationTriggerMetadata | undefined {
    switch (animationSlug) {
      case 'fadeInOut':
        return trigger('fadeInOut', [
          transition(':enter', [
            style({ opacity: '0' }),
            animate('300ms ease-in', style({ opacity: '1.0' })),
          ]),
          transition(':leave', [
            animate('300ms ease-out', style({ opacity: '0' })),
          ]),
        ]);
      case 'slideInOutRight':
        return trigger('slideInOut', [
          state(
            'show',
            style({
              right: '0px',
            })
          ),
          state(
            'hide',
            style({
              right: `${optionalStyle}`,
            })
          ),
          transition('show => hide', [animate('.25s')]),
          transition('hide => show', [animate('.25s')]),
        ]);
      default:
        return undefined;
    }
  }
}
