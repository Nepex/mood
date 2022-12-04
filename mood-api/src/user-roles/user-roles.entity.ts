import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  Validate,
} from 'class-validator';
import { PrimaryGeneratedColumn, Entity } from 'typeorm';

import { Role } from './user-roles.model';
import { UidValidator } from '../util';

@Entity('user_roles')
export class UserRolesEntity {
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
  @IsEnum(Role, { each: true })
  roles: Role[];

  @IsDate()
  @IsOptional()
  createdAt: Date;

  @IsDate()
  @IsOptional()
  updatedAt: Date;

  constructor(entity?: Partial<UserRolesEntity>) {
    if (entity) {
      Object.assign(this, entity);
    }
  }
}
