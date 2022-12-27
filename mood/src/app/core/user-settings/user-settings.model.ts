export class UserSettingsModel {
  uid: string;
  showMoodScoresOnCalendar: boolean;
  createdTs: Date;
  updatedTs: Date;

  constructor(model?: Partial<UserSettingsModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
