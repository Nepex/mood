import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { LocalStorageService } from 'ngx-webstorage';

import { Logger } from '@shared';

import { AuthState, Credentials, Session } from './auth.model';
import { BaseService } from '../base.service';
import { Role } from '../user-roles/user-roles.model';
import { User } from '../user/user.model';
import { UserRolesService } from '../user-roles/user-roles.service';

const logger = new Logger('AuthService');

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  static STORAGE_KEYS = { TOKEN: 'token' };
  state: Partial<AuthState> = {};

  constructor(
    public http: HttpClient,
    private readonly localStorage: LocalStorageService,
    private readonly userRolesService: UserRolesService
  ) {
    super('auth', http);
    this.loadStoredSession();
  }

  /** Checks if there is a stored session when app loads for the first time. */
  loadStoredSession() {
    const existingToken = this.localStorage.retrieve(
      AuthService.STORAGE_KEYS.TOKEN
    );

    if (existingToken) {
      this.state.session = {
        token: existingToken,
      };
    }
  }

  /** Returns current JWT if there is an active session. */
  getToken(): string | null {
    return this.state.session?.token ?? null;
  }

  /** Checks if there is an active session. */
  isAuthenticated(): boolean {
    return this.state.session?.token ? true : false;
  }

  /** Attempts to login a user with Credentials. */
  async login(credentials: Credentials) {
    if (this.state.session) {
      throw new Error('Already logged in');
    }

    const response = this.http.post<Session>(
      `${this.baseUrl}/login`,
      credentials
    );

    try {
      const session = await lastValueFrom(response);
      this.localStorage.store(AuthService.STORAGE_KEYS.TOKEN, session.token);

      this.loadStoredSession();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /** Attempts to register a user with Credentials. */
  async register(credentials: Credentials) {
    try {
      const response = this.http.post<Session>(
        `${this.baseUrl}/register`,
        credentials
      );
      return lastValueFrom(response);
    } catch (err) {
      throw new Error(err);
    }
  }

  /** Logout user and clear local storage. */
  logout() {
    this.state = {};
    this.localStorage.clear(AuthService.STORAGE_KEYS.TOKEN);
  }

  /** Gets current user if session exists. */
  async me(): Promise<User> {
    if (!this.isAuthenticated()) {
      return null;
    }

    try {
      const response = this.http.get<User>(`${this.baseUrl}/me`);
      return lastValueFrom(response);
    } catch (err) {
      throw new Error(err);
    }
  }
}
