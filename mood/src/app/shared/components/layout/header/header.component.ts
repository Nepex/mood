import { Component, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { Subject, Subscription, throttleTime } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

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
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('300ms ease-in', style({ opacity: '1.0' })),
      ]),
    ]),
  ],
})
export class HeaderComponent extends BaseController implements OnDestroy {
  @ViewChild('navMenuItems', { static: false })
  navMenuItems: any;

  @HostListener('window:scroll', ['$event'])
  handleWindowScroll() {
    this.windowScrolledSubject.next(null);
  }

  stateSub: Subscription;
  me: UserModel | undefined;
  layoutState: LayoutState | undefined;
  windowScrolledSubject = new Subject();

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

  async ngAfterViewInit() {
    // close menus on scroll
    this.windowScrolledSubject
      .asObservable()
      .pipe(throttleTime(50, undefined, { trailing: true }))
      .subscribe(() => {
        this.navMenuItems.hide();
      });

    this.windowScrolledSubject.next(null);
  }

  ngOnDestroy() {
    this.stateSub.unsubscribe();
    this.windowScrolledSubject.unsubscribe();
  }
}
