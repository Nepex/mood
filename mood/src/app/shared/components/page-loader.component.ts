import { Component, Input } from '@angular/core';

import { Util } from '../common/util';

@Component({
  selector: 'mood-page-loader',
  template: `
    <div
      class="load-container"
      [@fadeInOut]
      *ngIf="loading"
      [ngStyle]="{ position: positionStyle }"
      [ngClass]="{ sm: size === 'sm' }"
    >
      <p-progressSpinner></p-progressSpinner>
    </div>
  `,
  styles: [
    `
      @import 'variables';

      ::ng-deep {
        .load-container {
          display: flex;
          justify-content: center;
          align-items: center;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: transparentize($DARK_GRAY, 0.5);
          backdrop-filter: blur(3px);
          z-index: 9999;

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
export class PageLoaderComponent {
  @Input() loading: boolean;
  @Input() positionStyle: 'absolute' | 'fixed' = 'fixed';
  @Input() size: 'sm' | 'lg' = 'lg';
}
