import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Role } from '../user-roles/user-roles.model';

@Injectable()
export class ModeratorGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: Error) {
    if (user.roles.indexOf(Role.Moderator) > -1) {
      return user;
    } else {
      throw new UnauthorizedException(
        'This resource requires moderator privileges.',
      );
    }
  }
}
