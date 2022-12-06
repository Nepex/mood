export class JournalDaySettingsModel {
  uid: string;
  day: string; // MM-DD-YYYY
  notes: string;
  color: string; // hex
  createdAt: Date;
  updatedAt: Date;

  constructor(model?: Partial<JournalDaySettingsModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
