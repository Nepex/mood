import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { StoreService, UserModel } from '@core';

@Component({
  selector: 'mood-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnDestroy {
  me: UserModel | undefined;
  stateSub: Subscription;

  constructor(private readonly store: StoreService) {
    this.stateSub = this.store.state$.subscribe(
      (state) => (this.me = state.me)
    );
  }

  ngOnDestroy() {
    this.stateSub.unsubscribe();
  }
}
