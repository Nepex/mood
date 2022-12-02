import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './utils';
import { RequestValidationService } from './request-validation.service';
import { UserModule } from '../user/user.module';
import { UserStrategy } from './user.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserStrategy, RequestValidationService],
  exports: [AuthService, RequestValidationService],
})
export class AuthModule {}
