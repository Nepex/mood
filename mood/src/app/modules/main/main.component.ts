import { Component } from '@angular/core';

import { BaseControllerService, Logger, BaseController } from '@shared';

const logger = new Logger('MainComponent');

@Component({
  selector: 'mood-main',
  templateUrl: './main.component.html',
})
export class MainComponent extends BaseController {
  constructor(public baseService: BaseControllerService) {
    super(baseService);
  }
}
