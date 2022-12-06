import { EventEmitter, Injectable, Injector, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ConfirmationService, MessageService } from 'primeng/api';

import { Breadcrumb } from '../types';
import { Logger } from '../logger';

const logger = new Logger('BaseControllerService');

@Injectable({ providedIn: 'root' })
export class BaseControllerService {
  @Output() toggleLoading = new EventEmitter<boolean>(true);
  @Output() listFetched = new EventEmitter<null>();
  @Output() popOverConfirmed = new EventEmitter<string>();
  @Output() searchTriggered = new EventEmitter<string>();
  @Output() breadcrumbsSet = new EventEmitter<Breadcrumb[]>(true);

  notificationService: MessageService;
  confirmationService: ConfirmationService;
  route: ActivatedRoute;
  router: Router;

  queryParams: Params;

  constructor(public injector: Injector) {
    this.notificationService = this.injector.get(MessageService);
    this.confirmationService = this.injector.get(ConfirmationService);
    this.route = this.injector.get(ActivatedRoute);
    this.router = this.injector.get(Router);

    this.queryParams = this.route.snapshot.queryParams;
  }
}
