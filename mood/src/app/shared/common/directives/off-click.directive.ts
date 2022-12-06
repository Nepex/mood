import {
  Directive,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
} from '@angular/core';

/**
 * Fires event handler when anything outside of element is clicked
 *
 * EXAMPLE USAGE <span (offclick)="doSomething()" />
 */
@Directive({
  selector: '[offclick]',
})
export class OffClickDirective {
  @Output('offclick') offClicked = new EventEmitter<null>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:mouseup', ['$event.target'])
  onClick(target: ElementRef) {
    if (!this.elementRef.nativeElement.contains(target)) {
      this.offClicked.emit();
    }
  }
}
