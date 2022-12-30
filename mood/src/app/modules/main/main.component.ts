import { Component, OnInit } from '@angular/core';

import { BaseControllerService, Logger, BaseController } from '@shared';

const logger = new Logger('MainComponent');

@Component({
  selector: 'mood-main',
  templateUrl: './main.component.html',
})
export class MainComponent extends BaseController implements OnInit {
  constructor(public baseService: BaseControllerService) {
    super(baseService);
  }

  ngOnInit() {
    logger.success('Loaded MainModule');
  }
}
