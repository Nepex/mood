import { IsDate, IsNumber, IsOptional, Validate } from 'class-validator';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { Role } from './user-roles.model';
import { UidValidator } from '../util';
import { UserEntity } from '../user/user.entity';

@Entity()
export class UserRolesEntity {
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
    array: true,
    type: 'enum',
    enum: Role,
    nullable: false,
    default: [Role.User],
  })
  @IsOptional()
  roles: Role[];

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

  constructor(entity?: Partial<UserRolesEntity>) {
    if (entity) {
      Object.assign(this, entity);
    }
  }
}
