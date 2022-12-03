import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { Session } from '../util';
import { UserEntity } from '../user/user.entity';
import { UserRolesEntity } from '../user-roles/user-roles.entity';
import { UserRolesService } from '../user-roles/user-roles.service';
import { UserService } from '../user/user.service';
import { UserSettingsEntity } from '../user-settings/user-settings.entity';
import { UserSettingsService } from '../user-settings/user-settings.service';

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

    const isCorrectPassword = await bcrypt.compare(password, user?.password);

    if (!isCorrectPassword) {
      throw new BadRequestException('Invalid email or password');
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

    if (await this.doesEmailAlreadyExist(user.email)) {
      throw new BadRequestException('Email already exists');
    }

    const newUser = new UserEntity({
      email: user.email,
      password: await bcrypt.hash(user.password, 10),
    });

    await this.createUser(newUser);
  }

  async doesEmailAlreadyExist(email: string): Promise<boolean> {
    const existingEmail = await this.userService.findOne({
      email,
    });

    return existingEmail ? true : false;
  }

  async createUser(newUser: UserEntity) {
    const user = await this.userService.save(newUser);

    const userRoles = await this.userRolesService.save(
      new UserRolesEntity({
        userId: user.id,
      }),
    );

    const userSettings = await this.userSettingsService.save(
      new UserSettingsEntity({
        userId: user.id,
      }),
    );

    await this.userService.save(
      new UserEntity({
        id: user.id,
        userRolesId: userRoles.id,
        userSettingsId: userSettings.id,
      }),
    );
  }
}
