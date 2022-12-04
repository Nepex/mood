import {
  IsOptional,
  Validate,
  IsDate,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

import { UidValidator } from '../util';
import { ColorTheme } from './user-settings.model';

@Entity('user_settings')
export class UserSettingsEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Validate(UidValidator)
  @IsOptional()
  uid: string;

  @IsNumber()
  @IsOptional()
  userId: number;

  @IsOptional()
  @IsEnum(ColorTheme)
  colorTheme: ColorTheme;

  @IsDate()
  @IsOptional()
  createdAt: Date;

  @IsDate()
  @IsOptional()
  updatedAt: Date;

  constructor(entity?: Partial<UserSettingsEntity>) {
    if (entity) {
      Object.assign(this, entity);
    }
  }
}
