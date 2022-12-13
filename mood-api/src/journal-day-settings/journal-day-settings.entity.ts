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
  @Column({ name: 'id' })
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'uid' })
  @Validate(UidValidator)
  @IsString()
  @IsOptional()
  uid: string;

  @Column({ name: 'user_id' })
  @IsNumber()
  @IsOptional()
  userId: number;

  @Column({ name: 'day' })
  @Validate(DayDateValidator)
  @IsOptional()
  day: string;

  @Column({ name: 'notes' })
  @MaxLength(1500)
  @IsOptional()
  notes: string;

  @Column({ name: 'color' })
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
