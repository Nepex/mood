import { IsOptional, Validate, IsDate, IsNumber } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { UidValidator } from '../util';
import { UserEntity } from '../user/user.entity';
import { ColorTheme } from './user-settings.model';

@Entity()
export class UserSettingsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 32, unique: true, update: false })
  @Validate(UidValidator)
  @IsOptional()
  uid: string;

  @Column({ name: 'user_id', nullable: false, unique: true, update: false })
  @IsNumber()
  @IsOptional()
  userId: number;

  // FK Constraint
  @JoinColumn({
    name: 'user_id',
  })
  @OneToOne(() => UserEntity)
  user: UserEntity;

  @Column({
    type: 'enum',
    enum: ColorTheme,
    nullable: false,
    default: [ColorTheme.Light],
  })
  @IsOptional()
  colorTheme: ColorTheme;

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

  constructor(entity?: Partial<UserSettingsEntity>) {
    if (entity) {
      Object.assign(this, entity);
    }
  }
}
