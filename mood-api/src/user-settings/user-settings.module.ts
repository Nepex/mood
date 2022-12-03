import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { QueryModule } from '../query/query.module';
import { UserSettingsEntity } from './user-settings.entity';
import { UserSettingsController } from './user-settings.controller';
import { UserSettingsService } from './user-settings.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSettingsEntity]),
    forwardRef(() => AuthModule),
    forwardRef(() => QueryModule),
  ],
  controllers: [UserSettingsController],
  providers: [UserSettingsService],
  exports: [UserSettingsService],
})
export class UserSettingsModule {}
