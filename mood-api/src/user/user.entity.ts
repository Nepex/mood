import {
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { PrimaryGeneratedColumn, Entity, Column } from 'typeorm';

import { UidValidator } from '../util';

@Entity('user')
export class UserEntity {
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @Validate(UidValidator)
  @IsOptional()
  uid: string;

  @IsEmail()
  @MinLength(5)
  @MaxLength(60)
  @IsOptional()
  email: string;

  @MinLength(8)
  @MaxLength(255)
  @IsOptional()
  password: string;

  @Column({ name: 'created_at' })
  @IsDate()
  @IsOptional()
  createdAt: Date;

  @Column({ name: 'updated_at' })
  @IsDate()
  @IsOptional()
  updatedAt: Date;

  constructor(entity?: Partial<UserEntity>) {
    if (entity) {
      Object.assign(this, entity);
    }
  }
}
