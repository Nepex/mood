export class UserSettingsModel {
  uid: string;
  createdTs: Date;
  updatedTs: Date;

  constructor(model?: Partial<UserSettingsModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
