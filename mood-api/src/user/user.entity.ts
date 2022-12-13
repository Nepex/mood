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
  @Column({ name: 'id' })
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'uid' })
  @Validate(UidValidator)
  @IsOptional()
  uid: string;

  @Column({ name: 'email' })
  @IsEmail()
  @MinLength(5)
  @MaxLength(60)
  @IsOptional()
  email: string;

  @Column({ name: 'password' })
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
