import { Component, Input } from '@angular/core';

import { Util } from '../common/util';

@Component({
  selector: 'mood-page-loader',
  template: `
    <div class="page-loading-mask flex-center" [@fadeInOut] *ngIf="loading">
      <p-progressSpinner></p-progressSpinner>
    </div>
  `,
  styles: [
    `
      @import 'variables';

      .page-loading-mask {
        top: 0;
        left: 0;
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: transparentize($GRAY_TWO, 0.5);
        backdrop-filter: blur(3px);
        z-index: 9999;
      }
    `,
  ],
  animations: [Util.getAni('fadeInOut')],
})
export class PageLoaderComponent {
  @Input() loading: boolean;
}
