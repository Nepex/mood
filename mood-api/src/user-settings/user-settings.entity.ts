import {
  IsOptional,
  Validate,
  IsDate,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { UidValidator } from '../util';
import { ColorTheme } from './user-settings.model';

@Entity('user_settings')
export class UserSettingsEntity {
  @IsNumber()
  @Column({ name: 'id' })
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

  @Column({ name: 'color_theme' })
  @IsOptional()
  @IsEnum(ColorTheme)
  colorTheme: ColorTheme;

  @Column({ name: 'created_at' })
  @IsDate()
  @IsOptional()
  createdAt: Date;

  @Column({ name: 'updated_at' })
  @IsDate()
  @IsOptional()
  updatedAt: Date;

  constructor(entity?: Partial<UserSettingsEntity>) {
    if (entity) {
      Object.assign(this, entity);
    }
  }
}
