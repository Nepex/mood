export class UserSettings {
  uid: string;
  isMusicOn: boolean;
  createdTs: Date;
  updatedTs: Date;

  constructor(model: Partial<UserSettings>) {
    for (const key of Object.keys(model)) {
      this[key] = model[key];
    }
  }
}
