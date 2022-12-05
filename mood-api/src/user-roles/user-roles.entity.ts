import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  Validate,
} from 'class-validator';
import { PrimaryGeneratedColumn, Entity, Column } from 'typeorm';

import { Role } from './user-roles.model';
import { UidValidator } from '../util';

@Entity('user_roles')
export class UserRolesEntity {
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

  @IsOptional()
  @IsEnum(Role, { each: true })
  roles: Role[];

  @Column({ name: 'created_at' })
  @IsDate()
  @IsOptional()
  createdAt: Date;

  @Column({ name: 'updated_at' })
  @IsDate()
  @IsOptional()
  updatedAt: Date;

  constructor(entity?: Partial<UserRolesEntity>) {
    if (entity) {
      Object.assign(this, entity);
    }
  }
}
