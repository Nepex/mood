import { EventEmitter, Injectable, Injector, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfirmationService, MessageService } from 'primeng/api';
import { StoreService } from '@core';

import { Logger } from '../logger';
import { SEOService } from '../services/seo.service';

const logger = new Logger('BaseControllerService');

@Injectable({ providedIn: 'root' })
export class BaseControllerService {
  // Events from layout component to communicate to other componenets
  @Output() searchTriggered = new EventEmitter<string>();
  @Output() actionTriggered = new EventEmitter<any>();
  @Output() listRefreshed = new EventEmitter<boolean | undefined>();

  seoService: SEOService;
  notificationService: MessageService;
  confirmationService: ConfirmationService;
  store: StoreService;
  route: ActivatedRoute;
  router: Router;

  constructor(public injector: Injector) {
    this.seoService = this.injector.get(SEOService);
    this.notificationService = this.injector.get(MessageService);
    this.confirmationService = this.injector.get(ConfirmationService);
    this.store = this.injector.get(StoreService);
    this.route = this.injector.get(ActivatedRoute);
    this.router = this.injector.get(Router);
  }
}
