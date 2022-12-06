export enum Role {
  User = 'user',
  Moderator = 'moderator',
  Admin = 'admin',
}
export class UserRolesModel {
  uid: string;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;

  constructor(model?: Partial<UserRolesModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
