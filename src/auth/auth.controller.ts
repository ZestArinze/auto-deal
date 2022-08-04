import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { Public } from './constants';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginInput } from './dto/login.input';
import { RegistrationInput } from './dto/registration.input';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signup(@Body() dto: RegistrationInput): Promise<User> {
    return await this.authService.signup(dto);
  }

  @Public()
  @Post('login')
  async login(@Body() dto: LoginInput): Promise<{ accessToken: string }> {
    return await this.authService.handleLogin(dto);
  }

  @Get('user')
  async authenticatedUser(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
