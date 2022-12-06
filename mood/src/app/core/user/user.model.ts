import { Role } from '../user-roles/user-roles.model';
import { UserSettings } from '../user-settings/user-settings.model';

export class User {
  uid: string;
  email: string;
  roles: Role[];
  settings: UserSettings;
  password?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(model: Partial<User>) {
    for (const key of Object.keys(model)) {
      this[key] = model[key];
    }
  }
}
