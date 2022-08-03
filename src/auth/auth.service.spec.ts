import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtService, ConfigService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user when supplied valid login credentials', async () => {
    const dto = {
      email: 'lucy@example.com',
      password: 'password',
    };

    const result = await service.validateLoginCredentials(dto);

    expect(result.password).toBeUndefined();
    expect(result.name).toBeDefined();
    expect(result).toMatchObject({
      id: expect.any(Number),
      email: dto.email,
    });
  });
});
