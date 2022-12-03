import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './util';
import { UserModule } from '../user/user.module';
import { UserRolesModule } from '../user-roles/user-roles.module';
import { UserSettingsModule } from '../user-settings/user-settings.module';
import { UserStrategy } from './user.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => UserRolesModule),
    forwardRef(() => UserSettingsModule),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserStrategy],
  exports: [AuthService],
})
export class AuthModule {}
