import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class JournalDaySettingsModel {
  @Expose()
  uid: string;

  @Expose()
  day: string;

  @Expose()
  color: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(entity?: Partial<JournalDaySettingsModel>) {
    if (entity) {
      Object.assign(this, entity);
    }
  }
}
