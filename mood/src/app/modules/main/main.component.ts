import { Component, OnInit } from '@angular/core';

import { BaseControllerService, Logger, BaseController } from '@shared';
import {
  trigger,
  transition,
  query,
  style,
  group,
  animate,
} from '@angular/animations';
import { RouterOutlet } from '@angular/router';

const logger = new Logger('MainComponent');

@Component({
  selector: 'mood-main',
  templateUrl: './main.component.html',
  animations: [
    trigger('fadeAnimation', [
      transition('* => *', [
        query(':enter', [style({ opacity: 0 })], {
          optional: true,
        }),
        // query(
        //   ':leave',
        //   [style({ opacity: 1 }), animate('0.15s', style({ opacity: 0 }))],
        //   { optional: true }
        // ),
        query(
          ':enter',
          [style({ opacity: 0 }), animate('0.2s', style({ opacity: 1 }))],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class MainComponent extends BaseController implements OnInit {
  constructor(public baseService: BaseControllerService) {
    super(baseService);
  }

  ngOnInit() {
    logger.success('Loaded MainModule');
  }

  prepareRoute(routerOutlet: RouterOutlet): string {
    return (
      routerOutlet &&
      routerOutlet.activatedRouteData &&
      routerOutlet.activatedRouteData['animation']
    );
  }
}
