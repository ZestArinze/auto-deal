import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { typeormPartialMock } from '../common/utils/test.utils';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const userData = {
    email: 'lucy@example.com',
    password: 'password',
    passwordConfirmation: 'password',
    name: 'Zest Arinze',
  };

  const mockUserRepo = {
    ...typeormPartialMock,

    getOne: jest.fn().mockReturnValue({ id: Date.now(), ...userData }),
    create: jest.fn().mockImplementation((dto) => {
      return dto;
    }),
    save: jest.fn().mockImplementation((dto) => {
      return Promise.resolve({ id: Date.now(), ...dto });
    }),
    findOne: jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: Date.now(),
        ...userData,
      }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user', async () => {
    const result = await service.create(userData, '1234qwer');

    expect(result).toMatchObject({
      id: expect.any(Number),
      email: userData.email,
      name: userData.name,
    });
  });

  it('should get user by email', async () => {
    await service.create(userData, '1234qwer');
    const result = await service.findOne(userData.email);

    expect(result).toMatchObject({
      id: expect.any(Number),
      email: userData.email,
      name: userData.name,
    });
  });

  it('should get user by id', async () => {
    const user = await service.create(userData, '1234qwer');
    const result = await service.findById(user.id);
    expect(result).toMatchObject({
      id: expect.any(Number),
      email: userData.email,
      name: userData.name,
    });
  });
});
