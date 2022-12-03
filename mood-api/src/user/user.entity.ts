import {
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { UidValidator } from '../util';
import { UserRolesEntity } from '../user-roles/user-roles.entity';
import { UserSettingsEntity } from '../user-settings/user-settings.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 32, unique: true, update: false })
  @Validate(UidValidator)
  @IsOptional()
  uid: string;

  @Column({ name: 'user_roles_id', nullable: true, unique: true })
  @IsNumber()
  @IsOptional()
  userRolesId: number;

  // FK Constraint
  @JoinColumn({
    name: 'user_roles_id',
  })
  @OneToOne(() => UserRolesEntity)
  userRoles: UserRolesEntity;

  @Column({ name: 'user_settings_id', nullable: true, unique: true })
  @IsNumber()
  @IsOptional()
  userSettingsId: number;

  // FK Constraint
  @JoinColumn({
    name: 'user_settings_id',
  })
  @OneToOne(() => UserSettingsEntity)
  userSettings: UserSettingsEntity;

  @Column({ nullable: false, length: 60, unique: true, update: false })
  @IsEmail()
  @MinLength(5)
  @MaxLength(60)
  @IsOptional()
  email: string;

  @Column({ nullable: false, length: 255 })
  @MinLength(8)
  @MaxLength(255)
  @IsOptional()
  password: string;

  @Column({
    type: 'timestamptz',
    name: 'created_ts',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  @IsDate()
  @IsOptional()
  createdAt: Date;

  @Column({
    type: 'timestamptz',
    name: 'updated_ts',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  @IsDate()
  @IsOptional()
  updatedAt: Date;

  constructor(entity?: Partial<UserEntity>) {
    if (entity) {
      Object.assign(this, entity);
    }
  }
}
