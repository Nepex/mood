import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import * as dayjs from 'dayjs';

import { MenuItem as PngMenuItem } from 'primeng/api';

import { AuthService, StoreService, UserModel } from '@core';
import { BaseController } from '../../../common/controllers/base.controller';
import { BaseControllerService } from '../../../common/controllers/base.controller.service';
import { Util } from '../../../common/util';
import { LayoutState } from 'src/app/shared/common/types';

@Component({
  selector: 'mood-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends BaseController implements OnDestroy {
  stateSub: Subscription;
  me: UserModel | undefined;
  layoutState: LayoutState | undefined;

  menuItems: PngMenuItem[] = [
    {
      label: 'Calendar',
      routerLink: `/calendar`,
    },
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
      label: 'Create Mood Entry',
      routerLink: `/entry/create/${dayjs().format('MM-DD-YYYY')}`,
    },
  ];

  constructor(
    public baseService: BaseControllerService,
    private readonly authService: AuthService,
    private readonly store: StoreService
  ) {
    super(baseService);
    this.stateSub = this.store.state$.subscribe(({ me, layout }) => {
      this.me = me;
      this.layoutState = layout;
    });
  }

  ngOnDestroy() {
    this.stateSub.unsubscribe();
  }
}
