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
  @Column({ name: 'id' })
  @IsNumber()
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

  @Column('text', { name: 'roles', array: true })
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
