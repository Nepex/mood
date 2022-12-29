import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

import { ColorTheme, LayoutState } from '../shared/common/types';
import { Session } from './auth/auth.model';
import { UserModel } from './user/user.model';

export interface AppState {
  me: UserModel;
  session: Session;
  layout: LayoutState;
}

export enum AppStateKey {
  Me = 'me',
  Session = 'session',
  Layout = 'layout',
}

export const defaultLayoutState: LayoutState = {
  isMobile: undefined,
  isScrolled: undefined,
  isScrolledToBottom: undefined,
  colorTheme: ColorTheme.Dark,
  loadingProcesses: 0,
  headerHeight: 80,
};

@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly _state = new BehaviorSubject<Partial<AppState>>({
    layout: defaultLayoutState,
  });
  readonly state$ = this._state.asObservable();

  get state(): Partial<AppState> {
    return this._state.getValue();
  }

  private set state(val: Partial<AppState>) {
    this._state.next(val);
  }

  async get(prop: AppStateKey): Promise<any> {
    const state = await firstValueFrom(this.state$);
    return state[prop];
  }

  set(prop: AppStateKey, val: any) {
    const state = { ...this.state };
    const existingData = state[prop];

    state[prop] = Array.isArray(val)
      ? [...(existingData ?? ([] as any)), ...val]
      : { ...existingData, ...val };

    this.state = { ...state };
  }

  remove(prop: AppStateKey, uid?: string) {
    const state = { ...this.state };

    if (!uid) {
      state[prop] = undefined;
    } else if (uid && Array.isArray(state[prop])) {
      state[prop] = (<any>state[prop]).filter((s: any) => s.uid !== uid);
    }

    this.state = { ...state };
  }

  clear() {
    this.state = {};
  }
}
