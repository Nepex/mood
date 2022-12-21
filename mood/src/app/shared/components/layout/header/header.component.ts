import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { MenuItem as PngMenuItem } from 'primeng/api';

import { AuthService, StoreService, UserModel } from '@core';
import { BaseController } from '../../../common/controllers/base.controller';
import { BaseControllerService } from '../../../common/controllers/base.controller.service';

@Component({
  selector: 'mood-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends BaseController implements OnDestroy {
  me: UserModel | undefined;
  stateSub: Subscription;

  menuItems: PngMenuItem[] = [
    {
      label: 'Logout',
      command: () => {
        this.handleLoad(async () => {
          this.authService.logout();
          await this.sleep(250);
          await this.baseService.router.navigateByUrl('/auth');
        });
      },
    },
  ];

  constructor(
    public baseService: BaseControllerService,
    private readonly authService: AuthService,
    private readonly store: StoreService
  ) {
    super(baseService);
    this.stateSub = this.store.state$.subscribe(
      (state) => (this.me = state.me)
    );
  }

  ngOnDestroy() {
    this.stateSub.unsubscribe();
  }
}
