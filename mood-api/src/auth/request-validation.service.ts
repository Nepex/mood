import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Logger } from '../util';

const logger = new Logger('RequestValidationService');

@Injectable()
export class RequestValidationService {
  async validateUserPrivilege(reqUserId: number, entityUserId: number) {
    if (reqUserId !== entityUserId) {
      throw new UnauthorizedException('Incorrect user');
    }
  }
}
