import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GenericObject } from '../common/generics';
import { typeormPartialMock } from '../common/utils/test.utils';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const signupDto = {
    email: 'lucy@example.com',
    password: 'password',
    passwordConfirmation: 'password',
    name: 'Zest Arinze',
  };

  const loginDto = {
    email: 'lucy@example.com',
    password: 'password',
  };

  const mockUserRepository = {
    create: jest.fn().mockImplementation((dto) => {
      return dto;
    }),

    createQueryBuilder: jest.fn(() => ({
      ...typeormPartialMock,

      getOne: jest.fn().mockReturnValueOnce({ id: Date.now(), ...signupDto }),
      getMany: jest
        .fn()
        .mockReturnValueOnce([{ id: Date.now(), ...signupDto }]),
    })),

    save: jest.fn().mockImplementation((dto) => {
      return Promise.resolve({ id: Date.now(), ...dto });
    }),

    findOne: jest.fn().mockImplementation((dto: GenericObject) =>
      Promise.resolve({
        id: Date.now(),
        ...signupDto,
      }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        ConfigService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user', async () => {
    const result = await service.signup(signupDto);

    expect(result.password).toBeUndefined();
    expect(result.name).toBeDefined();
    expect(result).toMatchObject({
      id: expect.any(Number),
      email: signupDto.email,
      name: signupDto.name,
    });
  });

  it('should return user when supplied valid login credentials', async () => {
    const result = await service.validateLoginCredentials(loginDto);
    expect(result.password).toBeUndefined();
    expect(result.name).toBeDefined();
    expect(result).toMatchObject({
      id: expect.any(Number),
      email: loginDto.email,
    });
  });

  it('should return null when supplied invalid login credentials', async () => {
    const result = await service.validateLoginCredentials({
      email: loginDto.email,
      password: 'xxc',
    });

    expect(result).toBeNull();
  });

  it('should return return access token', async () => {
    const result = await service.handleLogin(loginDto);
    expect(result.accessToken).toBeUndefined();
  });

  it('should throw when supplied incorrec login credentials', async () => {
    try {
      await service.handleLogin({
        email: loginDto.email,
        password: 'xxc',
      });
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);
      expect(e.message).toBe('Incorrect login credentials');
    }
  });
});
