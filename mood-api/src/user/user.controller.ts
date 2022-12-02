import { Controller, forwardRef, Inject, UseGuards } from '@nestjs/common';

import { Logger } from '../../utils/logger';
import { RequestValidationService } from '../auth/request-validation.service';
import { UserGuard } from '../auth/user.guard';
import { UserService } from './user.service';

const logger = new Logger('UserController');

@UseGuards(UserGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,

    @Inject(forwardRef(() => RequestValidationService))
    private readonly validationService: RequestValidationService,
  ) {}
}
