import { Component, Input } from '@angular/core';

@Component({
  selector: 'cascade-container',
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
  styleUrls: ['./container.component.scss'],
})
export class ContainerComponent {
  @Input() wrapperClasses = '';
  @Input() type: 'full' | 'normal' = 'normal';
}
