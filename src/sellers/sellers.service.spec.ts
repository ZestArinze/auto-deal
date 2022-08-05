import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { typeormPartialMock } from '../common/utils/test.utils';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Seller } from './entities/seller.entity';
import { SellersService } from './sellers.service';

describe('SellersService', () => {
  let service: SellersService;

  const sellerData = {
    id: 1,
    company_name: 'A&B Limited',
    email: 'lucy@example.com',
    address: '123 Main Street',
    userIds: [1],
  };

  const user1 = {
    id: 1,
    email: 'lucy@example.com',
  };

  const sellerRepoMock = {
    ...typeormPartialMock,

    create: jest.fn().mockImplementation((dto) => {
      return dto;
    }),

    save: jest.fn().mockImplementation((dto) => {
      return Promise.resolve({ id: Date.now(), ...dto });
    }),

    getOne: jest.fn().mockImplementation((id: number) => ({
      ...sellerData,
      id: id,
      users: [user1],
    })),

    findOne: jest.fn().mockReturnValue({
      ...sellerData,
      id: Date.now(),
      users: [user1],
    }),

    getMany: jest.fn().mockReturnValue([{ ...sellerData, users: [user1] }]),
  };

  // const userRepoMock = {
  //   ...typeormPartialMock,
  //   getMany: jest.fn().mockReturnValue([{ ...sellerData, id: Date.now() }]),
  //   findOne: jest.fn().mockImplementation((id: number) =>
  //     Promise.resolve({
  //       ...user1,
  //       id: id,
  //     }),
  //   ),
  // };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SellersService,
        UsersService,
        {
          provide: getRepositoryToken(Seller),
          useValue: sellerRepoMock,
        },
        {
          provide: getRepositoryToken(User),
          useValue: jest.fn().mockReturnThis(),
        },
      ],
    }).compile();

    service = module.get<SellersService>(SellersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create seller', async () => {
    const result = await service.create(sellerData);

    expect(result).toMatchObject({
      id: expect.any(Number),
    });

    expect(result.users).toHaveLength(1);
  });

  it('should gets list of sellers', async () => {
    await service.create(sellerData);
    const result = await service.findMany({});

    expect(Array.isArray(result)).toBe(true);

    expect(result[0]).toMatchObject({
      id: expect.any(Number),
      email: sellerData.email,
      company_name: sellerData.company_name,
    });
  });

  it('should get sellers users', async () => {
    await service.create(sellerData);
    const result = await service.findMany({});

    expect(result[0].users).toHaveLength(1);
  });

  it('should get a seller', async () => {
    const seller = await service.create(sellerData);
    const result = await service.findOne(seller.id);

    expect(result).toMatchObject({
      email: sellerData.email,
    });
  });

  it('should gets a seller users', async () => {
    const seller = await service.create(sellerData);
    const result = await service.findOne(seller.id);
    expect(result.users).toHaveLength(1);
  });

  it('should update seller', async () => {
    const seller = await service.create(sellerData);
    const result = await service.update(seller.id, sellerData);

    expect(result).toMatchObject({
      id: expect.any(Number),
      email: sellerData.email,
      company_name: sellerData.company_name,
    });

    expect(result.users).toHaveLength(1);
  });

  it('should deletes seller', async () => {
    const seller = await service.create(sellerData);
    expect(seller.id).toBeGreaterThan(0);

    const result = await service.remove(seller.id);
    expect(result.affected).toBe(1);
  });
});
