import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Role } from '../user-roles/user-roles.model';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: Error) {
    if (user.roles.indexOf(Role.Admin) > -1) {
      return user;
    } else {
      throw new UnauthorizedException(
        'This resource requires admin privileges.',
      );
    }
  }
}
