import { Component, Input } from '@angular/core';

@Component({
  selector: 'mood-container',
  styles: [
    `
      @import 'variables';

      .container {
        width: 100%;
        padding: 15px;
        margin-right: auto;
        margin-left: auto;

        @media (min-width: $SM_BREAKPOINT) {
          width: 540px;
        }
        @media (min-width: $MD_BREAKPOINT) {
          width: 720px;
        }
        @media (min-width: $LG_BREAKPOINT) {
          width: 960px;
        }
        @media (min-width: $XL_BREAKPOINT) {
          width: 1140px;
        }
      }

      .container-full {
        height: 100%;
        width: 100%;
      }
    `,
  ],
  template: `
    <section
      class="{{ wrapperClasses }}"
      [ngClass]="{
        container: type === 'normal',
        'container-full': type === 'full'
      }"
    >
      <ng-content></ng-content>
    </section>
  `,
})
export class ContainerComponent {
  @Input() wrapperClasses = '';
  @Input() type: 'full' | 'normal' = 'normal';
}
