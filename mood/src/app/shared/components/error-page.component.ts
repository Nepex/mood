import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ErrorPageType } from '../common/types';

@Component({
  selector: 'cascade-page-not-found',
  template: `
    <cascade-container type="full" wrapperClasses="flex-center flex-column">
      <i class="las la-sad-cry text-8xl mb-3"></i>

      <ng-container *ngIf="errorType === '404'">
        <h1>404: Page Not Found</h1>
        <div class="mt-3">
          Oops! Looks like the page you requested does not exist
        </div>
      </ng-container>

      <ng-container *ngIf="errorType === '503-unavailable'">
        <h1>503: Service Unavailable</h1>
        <div class="mt-3">
          Sorry, we're experiencing technical difficulties and will be back as
          soon as possible.
        </div>
      </ng-container>
    </cascade-container>
  `,
  styleUrls: [],
})
export class ErrorPageComponent implements OnInit {
  @Input() errorType: ErrorPageType;

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit() {
    const errorType =
      this.route.snapshot.data.type ?? this.route.snapshot.queryParams.type;

    if (!this.errorType) {
      this.errorType = errorType ?? ErrorPageType.PageNotFound;
    }
  }
}
