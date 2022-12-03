import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QueryModule } from '../query/query.module';
import { UserRolesEntity } from './user-roles.entity';
import { UserRolesController } from './user-roles.controller';
import { UserRolesService } from './user-roles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRolesEntity]),
    forwardRef(() => QueryModule),
  ],
  controllers: [UserRolesController],
  providers: [UserRolesService],
  exports: [UserRolesService],
})
export class UserRolesModule {}
