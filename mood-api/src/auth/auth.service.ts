import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { Logger, Session } from '../util';
import { UserEntity } from '../user/user.entity';
import { UserRolesEntity } from '../user-roles/user-roles.entity';
import { UserRolesService } from '../user-roles/user-roles.service';
import { UserService } from '../user/user.service';
import { UserSettingsEntity } from '../user-settings/user-settings.entity';
import { UserSettingsService } from '../user-settings/user-settings.service';

const logger = new Logger('AuthService');

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserRolesService))
    private readonly userRolesService: UserRolesService,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @Inject(forwardRef(() => UserSettingsService))
    private readonly userSettingsService: UserSettingsService,

    private readonly jwtService: JwtService,
  ) {}

  async validateLogin(email: string, password: string): Promise<UserEntity> {
    const user = await this.userService.findOne({ email });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  async login(user: UserEntity): Promise<Session> {
    const userRoles = await this.userRolesService.findOne({ userId: user.id });
    const payload = { email: user.email, id: user.id, roles: userRoles.roles };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async register(user: Partial<UserEntity>) {
    user.email = user.email.toLocaleLowerCase();

    if (
      await this.userService.findOne({
        email: user.email,
      })
    ) {
      throw new BadRequestException('Email already exists');
    }

    await this.createUser(
      new UserEntity({
        email: user.email,
        password: await bcrypt.hash(user.password, 10),
      }),
    );
  }

  async createUser(newUser: UserEntity) {
    const user = await this.userService.save(newUser);

    await this.userRolesService.save(
      new UserRolesEntity({
        userId: user.id,
      }),
    );

    await this.userSettingsService.save(
      new UserSettingsEntity({
        userId: user.id,
      }),
    );
  }
}
