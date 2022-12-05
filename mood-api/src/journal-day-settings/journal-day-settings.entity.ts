import {
  IsDate,
  IsHexColor,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Validate,
} from 'class-validator';
import { PrimaryGeneratedColumn, Entity, Column } from 'typeorm';

import { DayDateValidator, UidValidator } from '../util';

@Entity('journal_day_settings')
export class JournalDaySettingsEntity {
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @Validate(UidValidator)
  @IsString()
  @IsOptional()
  uid: string;

  @Column({ name: 'user_id' })
  @IsNumber()
  @IsOptional()
  userId: number;

  @Validate(DayDateValidator)
  @IsOptional()
  day: string;

  @MaxLength(1500)
  @IsOptional()
  notes: string;

  @IsHexColor()
  @IsOptional()
  color: string;

  @Column({ name: 'created_at' })
  @IsDate()
  @IsOptional()
  createdAt: Date;

  @Column({ name: 'updated_at' })
  @IsDate()
  @IsOptional()
  updatedAt: Date;

  constructor(entity?: Partial<JournalDaySettingsEntity>) {
    if (entity) {
      Object.assign(this, entity);
    }
  }
}
