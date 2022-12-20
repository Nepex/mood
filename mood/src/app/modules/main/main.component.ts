import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core';

import { BaseControllerService, Logger, BaseController } from '@shared';

const logger = new Logger('MainComponent');

@Component({
  selector: 'mood-main',
  templateUrl: './main.component.html',
})
export class MainComponent extends BaseController implements OnInit {
  constructor(
    public baseService: BaseControllerService,
    private readonly authService: AuthService
  ) {
    super(baseService);
  }

  ngOnInit() {
    logger.success('Loaded MainModule');
  }

  async logout() {
    this.authService.logout();
    await this.baseService.router.navigateByUrl('/auth/login');
  }
}
