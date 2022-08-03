import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginInput } from './dto/login.input';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

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
    const user = await this.usersService.findOne(email);
    if (!user) {
      return null;
    }

    try {
      //TODO:   const passwordMatches = await bcrypt.compare(password, user.password);
      const passwordMatches = password === user.password;
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
    if (!user) {
      throw new UnauthorizedException('Incorrect login credentials');
    }

    const issuedAt = new Date();
    const payload = {
      username: user.email,
      sub: user.id,
      iat: issuedAt,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken: accessToken,
    };
  }
}
