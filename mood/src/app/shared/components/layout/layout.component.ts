import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { AppStateKey, defaultLayoutState } from '@core';
import { Subject, Subscription, throttleTime } from 'rxjs';

import { BaseController } from '../../common/controllers/base.controller';
import { BaseControllerService } from '../../common/controllers/base.controller.service';
import { Logger } from '../../common/logger';
import { LayoutState } from '../../common/types';

const logger = new Logger('LayoutComponent');

@Component({
  selector: 'mood-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent
  extends BaseController
  implements AfterViewInit, OnDestroy
{
  // Loader
  stateListener: Subscription;
  layoutState = defaultLayoutState;

  windowViewChanged = new Subject();

  @HostListener('window:resize', ['$event'])
  handleWindowResize() {
    this.windowViewChanged.next(null);
  }

  @HostListener('window:scroll', ['$event'])
  handleWindowScroll() {
    this.windowViewChanged.next(null);
  }

  constructor(public baseService: BaseControllerService) {
    super(baseService);

    this.stateListener = this.baseService.store.state$.subscribe(
      async ({ layout }) => {
        this.layoutState = layout ?? defaultLayoutState;
      }
    );
  }

  async ngAfterViewInit() {
    this.windowViewChanged
      .asObservable()
      .pipe(throttleTime(100, undefined, { trailing: true }))
      .subscribe(() => this.setLayoutState());

    this.windowViewChanged.next(null);
  }

  ngOnDestroy() {
    this.stateListener.unsubscribe();
  }

  setLayoutState() {
    if (window.innerWidth <= 992) {
      this.baseService.store.set(AppStateKey.Layout, <LayoutState>{
        isMobile: true,
      });
    } else {
      this.baseService.store.set(AppStateKey.Layout, <LayoutState>{
        isMobile: false,
      });
    }

    if (
      window.scrollY > this.layoutState.headerHeight ||
      (this.layoutState.isScrolled && window.scrollY > 0)
    ) {
      this.baseService.store.set(AppStateKey.Layout, <LayoutState>{
        isScrolled: true,
      });
    } else {
      this.baseService.store.set(AppStateKey.Layout, <LayoutState>{
        isScrolled: true,
      });
    }
  }
}
