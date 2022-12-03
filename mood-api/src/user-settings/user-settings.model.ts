import { Exclude, Expose } from 'class-transformer';

export enum ColorTheme {
  Light = 'light',
  Dark = 'dark',
}

@Exclude()
export class UserSettingsModel {
  @Expose()
  readonly uid: string;

  @Expose()
  readonly colorTheme: ColorTheme;

  @Expose()
  readonly createdAt: Date;

  @Expose()
  readonly updatedAt: Date;

  constructor(model?: Partial<UserSettingsModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
