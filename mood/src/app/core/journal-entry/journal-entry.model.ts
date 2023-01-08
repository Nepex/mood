import { Emoji } from './journal-entry.types';

export class JournalEntryModel {
  uid: string;
  score: number;
  mood: string;
  emoji: Emoji;
  entry: string;
  entryAt: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(model?: Partial<JournalEntryModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
