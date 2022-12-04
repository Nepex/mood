import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Role } from '../../user-roles/user-roles.model';
import { UserJwtPayload } from '../util';
import { Logger } from '../../util';

const logger = new Logger('ModeratorGuard');

@Injectable()
export class ModeratorGuard extends AuthGuard('jwt') {
  handleRequest(err: any, req: UserJwtPayload | any) {
    if (err) logger.debug(err);

    if ((<UserJwtPayload>req).user.roles.indexOf(Role.Admin) > -1) {
      return req;
    } else {
      throw new UnauthorizedException(
        'This resource requires moderator privileges.',
      );
    }
  }
}
