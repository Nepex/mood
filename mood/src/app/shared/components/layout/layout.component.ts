import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { Subject, Subscription, throttleTime } from 'rxjs';

import { BaseController } from '../../common/controllers/base.controller';
import { BaseControllerService } from '../../common/controllers/base.controller.service';

@Component({
  selector: 'mood-main-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class MainLayoutComponent
  extends BaseController
  implements AfterViewInit, OnDestroy
{
  // Loader
  loadingListener: Subscription;
  loadingProcesses = 0;

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

    this.loadingListener = this.baseService.toggleLoading.subscribe(
      (isLoading) =>
        isLoading ? this.loadingProcesses++ : this.loadingProcesses--
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
    this.loadingListener.unsubscribe();
  }

  setLayoutState() {
    if (window.innerWidth <= 992) {
      this.baseService.setLayoutIsMobile(true);
    } else {
      this.baseService.layoutState.isMobileMenuOpen = false;
      this.baseService.setLayoutIsMobile(false);
    }

    if (
      window.scrollY > 120 ||
      (this.baseService.layoutState.isScrolled && window.scrollY > 0)
    ) {
      this.baseService.setLayoutScrolled(true);
    } else {
      this.baseService.setLayoutScrolled(false);
    }
  }
}
