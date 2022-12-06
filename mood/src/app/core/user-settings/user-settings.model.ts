export enum ColorTheme {
  Light = 'light',
  Dark = 'dark',
}

export class UserSettingsModel {
  uid: string;
  colorTheme: ColorTheme;
  createdTs: Date;
  updatedTs: Date;

  constructor(model?: Partial<UserSettingsModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
