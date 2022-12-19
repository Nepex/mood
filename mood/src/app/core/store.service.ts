import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

import { Session } from './auth/auth.model';
import { UserModel } from './user/user.model';

export interface AppState {
  me: UserModel;
  session: Session;
}

@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly _state = new BehaviorSubject<Partial<AppState>>({});
  readonly state$ = this._state.asObservable();

  get state(): Partial<AppState> {
    return this._state.getValue();
  }

  private set state(val: Partial<AppState>) {
    this._state.next(val);
  }

  async get(prop: keyof AppState): Promise<any> {
    const state = await firstValueFrom(this.state$);
    return state[prop];
  }

  save(prop: keyof AppState, val: any) {
    const existingData = this.state[prop];

    this.state[prop] = Array.isArray(val)
      ? [...(existingData ?? ([] as any)), ...val]
      : { ...existingData, ...val };

    this.state = { ...this.state };
  }

  remove(prop: keyof AppState, uid?: string) {
    if (!uid) {
      this.state[prop] = undefined;
    } else if (uid && Array.isArray(this.state[prop])) {
      this.state[prop] = (<any>this.state[prop]).filter(
        (s: any) => s.uid !== uid
      );
    }

    this.state = { ...this.state };
  }

  clear() {
    this.state = {};
  }
}
