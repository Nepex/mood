import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Util } from '../common/util';

@Component({
  selector: 'mood-load-spinner',
  template: `
    <div
      class="load-container"
      [@fadeInOut]
      *ngIf="loading"
      [ngStyle]="{ position: positionStyle }"
      [ngClass]="{ sm: size === 'sm' }"
      [attr.zIndex]="zIndex"
    >
      <p-progressSpinner></p-progressSpinner>
    </div>
  `,
  styles: [
    `
      @import 'variables';
      @import 'mixins';

      ::ng-deep {
        .load-container {
          @include flex-center();
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: transparentize($DARK_GRAY, 0.5);
          backdrop-filter: blur(3px);

          &.sm {
            .p-progress-spinner {
              width: 50px;
              height: 50px;
            }
          }
        }
      }
    `,
  ],
  animations: [Util.getAni('fadeInOut')],
})
export class LoadSpinnerComponent implements OnChanges {
  @Input() loading: boolean;
  @Input() positionStyle: 'absolute' | 'fixed' = 'fixed';
  @Input() size: 'sm' | 'lg' = 'lg';

  zIndex = 9999;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.positionStyle?.currentValue === 'absolute') {
      this.zIndex = 1;
    }
  }
}
