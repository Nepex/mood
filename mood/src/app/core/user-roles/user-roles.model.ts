export enum Role {
  User = 'user',
  Moderator = 'moderator',
  Admin = 'admin',
}
export class UserRoles {
  uid: string;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;

  constructor(model: Partial<UserRoles>) {
    for (const key of Object.keys(model)) {
      this[key] = model[key];
    }
  }
}
