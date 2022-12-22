import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { MenuItem as PngMenuItem } from 'primeng/api';

import { AuthService, StoreService, UserModel } from '@core';
import { BaseController } from '../../../common/controllers/base.controller';
import { BaseControllerService } from '../../../common/controllers/base.controller.service';
import { Util } from '../../../common/util';

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
      command: async () => {
        await this.handleLoad(async () => {
          await this.sleep(Util.SOFT_DELAY);
          this.authService.logout();
          await this.baseService.router.navigateByUrl('/auth');
        });
      },
    },
  ];

  addMenuItems: PngMenuItem[] = [
    {
      label: 'Add Mood',
    },
    {
      label: 'Add Journal Entry',
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
