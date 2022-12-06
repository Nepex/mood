import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { Util } from '../common/util';

@Component({
  selector: 'cascade-form-validation-msgs',
  template: `
    <span
      *ngIf="(control.errors && control.touched) || showErrors"
      class="error"
    >
      <div *ngIf="control.errors?.required">Required</div>
      <div *ngIf="control.errors?.pattern">Invalid format</div>
      <div *ngIf="control.errors?.maxlength">
        Max {{ control.errors?.maxlength.requiredLength }} characters
      </div>
      <div *ngIf="control.errors?.minlength">
        Minimum {{ control.errors?.minlength.requiredLength }} characters
      </div>
      <div *ngIf="control.errors?.isntMatch">
        {{ capitalizeFirst(control.errors?.isntMatch) }}s don't match
      </div>
    </span>
  `,
  styles: [
    `
      @import 'variables';

      .error {
        color: $RED;
      }
    `,
  ],
})
export class FormValidationMsgsComponent {
  @Input() control: AbstractControl;
  @Input() showErrors: boolean;

  constructor() {}

  capitalizeFirst(str: string): string {
    return Util.capitalizeFirst(str);
  }
}
