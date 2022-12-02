import { Exclude, Expose } from 'class-transformer';

import { Role } from '../user-roles/user-roles.model';
import { UserSettingsModel } from '../user-settings/user-settings.model';

export enum RegistrationStep {
  RegistrationPending = 'registration-pending',
  AccountCreated = 'account-created',
  PlayerSaved = 'player-saved',
  AppearanceSaved = 'appearance-saved',
}

@Exclude()
export class UserModel {
  @Expose()
  readonly uid: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly roles: Role[];

  @Expose()
  readonly settings: UserSettingsModel;

  @Expose()
  readonly createdTs: Date;

  @Expose()
  readonly updatedTs: Date;

  constructor(model?: Partial<UserModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
