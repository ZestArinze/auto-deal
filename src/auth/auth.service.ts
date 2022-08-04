import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginInput } from './dto/login.input';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegistrationInput } from './dto/registration.input';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    readonly configService: ConfigService,
  ) {}

  async validateLoginCredentials({
    email,
    password,
  }: LoginInput): Promise<Partial<User> | null> {
    const user = await this.usersService.findOne(email, true);
    if (!user) {
      return null;
    }

    try {
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        return null;
      }
    } catch (error) {
      return null;
    }

    delete user.password;

    return user;
  }

  async handleLogin(dto: LoginInput): Promise<{ accessToken: string }> {
    const user = await this.validateLoginCredentials(dto);

    const invalidMsg = 'Incorrect login credentials';

    if (!user) {
      throw new UnauthorizedException(invalidMsg);
    }

    const payload = {
      username: user.email,
      sub: user.id,
    };

    try {
      const accessToken = this.jwtService.sign(payload);
      return {
        accessToken: accessToken,
      };
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signup(dto: RegistrationInput): Promise<User> {
    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create(dto, hash);

    return user;
  }
}
