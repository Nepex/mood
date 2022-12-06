import { Role } from '../user-roles/user-roles.model';
import { UserSettingsModel } from '../user-settings/user-settings.model';

export class UserModel {
  uid: string;
  email: string;
  roles: Role[];
  settings: UserSettingsModel;
  password?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(model?: Partial<UserModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
