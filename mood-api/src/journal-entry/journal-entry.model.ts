import { Exclude, Expose } from 'class-transformer';
import { Emoji } from './journal-entry.types';

@Exclude()
export class JournalEntryModel {
  @Expose()
  uid: string;

  @Expose()
  score: number;

  @Expose()
  mood: string;

  @Expose()
  emoji: Emoji;

  @Expose()
  entry: string;

  @Expose()
  entryAt: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(entity?: Partial<JournalEntryModel>) {
    if (entity) {
      Object.assign(this, entity);
    }
  }
}
