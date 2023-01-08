import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  Max,
  MaxLength,
  Min,
  MinLength,
  Validate,
} from 'class-validator';
import { PrimaryGeneratedColumn, Entity, Column } from 'typeorm';

import { Emoji } from './journal-entry.types';
import { UidValidator } from '../util';

@Entity('journal_entry')
export class JournalEntryEntity {
  @Column({ name: 'id' })
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'uid' })
  @Validate(UidValidator)
  @IsOptional()
  uid: string;

  @Column({ name: 'user_id' })
  @IsNumber()
  @IsOptional()
  userId: number;

  @Column({ name: 'score' })
  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  score: number;

  @Column({ name: 'mood' })
  @MinLength(1)
  @MaxLength(30)
  @IsOptional()
  mood: string;

  @Column({ name: 'emoji' })
  @IsEnum(Emoji)
  @IsOptional()
  emoji: Emoji;

  @Column({ name: 'entry' })
  @MaxLength(1500)
  @IsOptional()
  entry: string;

  @Column({ name: 'entry_at' })
  @IsDate()
  @IsOptional()
  entryAt: Date;

  @Column({ name: 'created_at' })
  @IsDate()
  @IsOptional()
  createdAt: Date;

  @Column({ name: 'updated_at' })
  @IsDate()
  @IsOptional()
  updatedAt: Date;

  constructor(entity?: Partial<JournalEntryEntity>) {
    if (entity) {
      Object.assign(this, entity);
    }
  }
}
