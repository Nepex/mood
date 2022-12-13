import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { BaseControllerService, Logger } from '@shared';

const logger = new Logger('AuthComponent');

@Component({
  selector: 'mood-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  loadingListener: Subscription;
  loadingProcesses = 0;

  constructor(private readonly baseService: BaseControllerService) {
    this.loadingListener = this.baseService.toggleLoading.subscribe(
      (isLoading) =>
        isLoading ? this.loadingProcesses++ : this.loadingProcesses--
    );
  }

  ngOnDestroy() {
    this.loadingListener.unsubscribe();
  }

  ngOnInit() {
    logger.success('Loaded AuthModule');
  }
}
