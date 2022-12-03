import { Exclude, Expose } from 'class-transformer';

export enum Role {
  User = 'user',
  Moderator = 'moderator',
  Admin = 'admin',
}

@Exclude()
export class UserRolesModel {
  @Expose()
  readonly uid: string;

  @Expose()
  readonly roles: Role[];

  @Expose()
  readonly createdAt: Date;

  @Expose()
  readonly updatedAt: Date;

  constructor(model?: Partial<UserRolesModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
