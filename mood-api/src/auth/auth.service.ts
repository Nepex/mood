import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    private readonly jwtService: JwtService,
  ) {}

  async validateLogin(email: string, password: string): Promise<User> {
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

  async login(user: User): Promise<Session> {
    // const userRoles = await this.userRolesService.findOne({ userId: user.id });

    const payload = { email: user.email, id: user.id }; // roles: userRoles.roles
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async register(user: Partial<User>) {
    user.email = user.email.toLocaleLowerCase();

    if (await this.doesEmailAlreadyExist(user.email)) {
      throw new BadRequestException('Email already exists');
    }

    const newUser = new User({
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

  async createUser(newUser: User) {
    const user = await this.userService.save(newUser);

    const userRoles = await this.userRolesService.save(
      new UserRoles({
        userId: user.id,
      }),
    );

    const userSettings = await this.userSettingsService.save(
      new UserSettings({
        userId: user.id,
      }),
    );

    await this.userService.save(
      new User({
        id: user.id,
        userRolesId: userRoles.id,
        userSettingsId: userSettings.id,
      }),
    );
  }
}
