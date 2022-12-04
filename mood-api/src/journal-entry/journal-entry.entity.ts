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
import { PrimaryGeneratedColumn, Entity } from 'typeorm';

import { Emoji } from './journal-entry.model';
import { UidValidator } from '../util';

@Entity('journal_entry')
export class JournalEntryEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Validate(UidValidator)
  @IsOptional()
  uid: string;

  @IsNumber()
  @IsOptional()
  userId: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  score: number;

  @MinLength(1)
  @MaxLength(30)
  @IsOptional()
  mood: string;

  @IsEnum(Emoji)
  @IsOptional()
  emoji: Emoji;

  @MaxLength(1500)
  @IsOptional()
  entry: string;

  @IsDate()
  @IsOptional()
  entryAt: Date;

  @IsDate()
  @IsOptional()
  createdAt: Date;

  @IsDate()
  @IsOptional()
  updatedAt: Date;

  constructor(entity?: Partial<JournalEntryEntity>) {
    if (entity) {
      Object.assign(this, entity);
    }
  }
}
