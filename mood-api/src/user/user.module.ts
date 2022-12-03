import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { QueryModule } from '../query/query.module';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserRolesModule } from '../user-roles/user-roles.module';
import { UserService } from './user.service';
import { UserSettingsModule } from '../user-settings/user-settings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => AuthModule),
    forwardRef(() => QueryModule),
    forwardRef(() => UserRolesModule),
    forwardRef(() => UserSettingsModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
