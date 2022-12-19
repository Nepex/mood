import { EventEmitter, Injectable, Injector, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ConfirmationService, MessageService } from 'primeng/api';

import { ColorTheme, LayoutState } from '../types';
import { Logger } from '../logger';

const logger = new Logger('BaseControllerService');

@Injectable({ providedIn: 'root' })
export class BaseControllerService {
  @Output() toggleLoading = new EventEmitter<boolean>(true);

  // Events from layout component to communicate to child componenets
  @Output() searchTriggered = new EventEmitter<string>();
  @Output() actionTriggered = new EventEmitter<any>();
  @Output() colorThemeChanged = new EventEmitter<ColorTheme>();
  @Output() layoutIsScrolled = new EventEmitter<boolean>();
  @Output() layoutIsMobile = new EventEmitter<boolean>();
  @Output() listRefreshed = new EventEmitter<boolean | undefined>();

  notificationService: MessageService;
  confirmationService: ConfirmationService;
  route: ActivatedRoute;
  router: Router;

  layoutState: Partial<LayoutState> = {
    isMobile: undefined,
    isScrolled: undefined,
    isMobileMenuOpen: undefined,
    colorTheme: ColorTheme.Dark,
  };

  queryParams: Params;

  constructor(public injector: Injector) {
    this.notificationService = this.injector.get(MessageService);
    this.confirmationService = this.injector.get(ConfirmationService);
    this.route = this.injector.get(ActivatedRoute);
    this.router = this.injector.get(Router);

    this.queryParams = this.route.snapshot.queryParams;
  }

  setLayoutScrolled(val: boolean) {
    this.layoutState.isScrolled = val;
    this.layoutIsScrolled.emit(val);
  }

  setLayoutIsMobile(val: boolean) {
    this.layoutState.isMobile = val;
    this.layoutIsMobile.emit(val);
  }
}
