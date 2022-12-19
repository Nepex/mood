import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { LocalStorageService } from 'ngx-webstorage';

import { Logger, Util } from '@shared';

import { Session, Credentials } from './auth.model';
import { BaseService } from '../base.service';
import { UserModel } from '../user/user.model';
import { StoreService } from '../store.service';

const logger = new Logger('AuthService');

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  static STORAGE_KEYS = { TOKEN: 'token' };
  session: Session | undefined;

  test: string;

  constructor(
    public http: HttpClient,
    public store: StoreService,
    private readonly localStorage: LocalStorageService
  ) {
    super('auth', http, store);
    this.loadStoredSession();

    this.store.state$.subscribe((state) => {
      this.session = state.session ?? undefined;
    });
  }

  /** Checks if there is a stored session when app loads for the first time. */
  loadStoredSession() {
    const existingToken = this.localStorage.retrieve(
      AuthService.STORAGE_KEYS.TOKEN
    );

    if (existingToken) {
      this.store.save('session', new Session({ token: existingToken }));
    }
  }

  /** Returns current JWT if there is an active session. */
  getToken(): string | null {
    return this.session?.token ?? null;
  }

  /** Checks if there is an active session. */
  isAuthenticated(): boolean {
    return !!this.session?.token;
  }

  /** Attempts to login a user with Credentials. */
  async login(credentials: Credentials) {
    if (this.session) {
      throw new Error('Already logged in');
    }

    try {
      const response = this.http.post<Session>(
        `${this.baseUrl}/login`,
        credentials
      );

      const session = await lastValueFrom(response);
      this.localStorage.store(AuthService.STORAGE_KEYS.TOKEN, session.token);

      this.loadStoredSession();
    } catch (err) {
      throw new Error(Util.parseError(err as HttpErrorResponse));
    }
  }

  /** Attempts to register a user with Credentials. */
  async register(credentials: Credentials) {
    const response = this.http.post<Session>(
      `${this.baseUrl}/register`,
      credentials
    );

    return lastValueFrom(response).catch((e) => {
      throw new Error(Util.parseError(e as HttpErrorResponse));
    });
  }

  /** Logout user and clear local storage. */
  logout() {
    this.store.remove('session');
    this.store.remove('me');
    this.localStorage.clear(AuthService.STORAGE_KEYS.TOKEN);
  }

  /** Gets current user if session exists. */
  async me(): Promise<UserModel | null> {
    if (!this.isAuthenticated()) {
      return null;
    }

    const response = this.http.get<UserModel>(`${this.baseUrl}/me`);
    try {
      const me = await lastValueFrom(response);
      this.store.save('me', me);
      return me;
    } catch (e) {
      throw new Error(Util.parseError(e as HttpErrorResponse));
    }
  }
}
