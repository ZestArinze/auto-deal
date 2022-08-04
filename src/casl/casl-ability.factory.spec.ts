import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Action } from '../auth/enums/permission.action';
import { RoleEnum } from '../auth/enums/role.enum';
import { User } from '../users/entities/user.entity';
import { CaslAbilityFactory } from './casl-ability.factory';
import { checkAbility } from './casl.utils';

let abilityFactory: CaslAbilityFactory;

const user: User = {
  id: Date.now(),
  email: 'lucy@example.com',
  password: 'password',
  name: 'Zest Arinze',
  createdAt: new Date(),
  updatedAt: new Date(),
  roles: [{ id: 1, title: RoleEnum.SuperAdmin }],
};

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [CaslAbilityFactory],
  }).compile();

  abilityFactory = module.get<CaslAbilityFactory>(CaslAbilityFactory);
});

describe('CaslAbilityFactory', () => {
  it('should be defined', () => {
    expect(abilityFactory).toBeDefined();
  });

  it('should throw when user does not have the right permission', () => {
    try {
      checkAbility(abilityFactory, { ...user, roles: [] }, Action.Manage, User);
    } catch (e) {
      expect(e).toBeInstanceOf(ForbiddenException);
      expect(e.message).toBe(
        "You don't have the right permissions to perform that action",
      );
    }
  });

  it('should do nothing when user does not have the right permission', () => {
    expect(
      checkAbility(abilityFactory, user, Action.Manage, User),
    ).toBeUndefined();
  });
});
