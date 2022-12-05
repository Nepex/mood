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

import { Emoji } from './journal-entry.model';
import { UidValidator } from '../util';

@Entity('journal_entry')
export class JournalEntryEntity {
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @Validate(UidValidator)
  @IsOptional()
  uid: string;

  @Column({ name: 'user_id' })
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
