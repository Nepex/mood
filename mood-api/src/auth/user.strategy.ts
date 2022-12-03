import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from '../user-roles/user-roles.model';

import { jwtConstants } from './util';

@Injectable()
export class UserStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: { id: string; email: string; roles: Role[] }) {
    return { id: payload.id, email: payload.email, roles: payload.roles };
  }
}
