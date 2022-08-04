import { IsString, Min, MinLength } from 'class-validator';
import { Match } from '../validator/match.decorator';
import { IsPasswordWorthy } from '../validator/password-worthy.decorator';

export class RegistrationInput {
  @IsString()
  email: string;

  @IsPasswordWorthy()
  @MinLength(8)
  @IsString()
  password: string;

  @IsString()
  @Match('password', {
    message: 'password and password confirmation do not match',
  })
  passwordConfirmation: string;

  @IsString()
  name: string;
}
