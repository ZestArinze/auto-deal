import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Action } from '../auth/enums/permission.action';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { checkAbility } from '../casl/casl.utils';
import { User } from './entities/user.entity';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly abilityFactory: CaslAbilityFactory,
  ) {}

  @Get()
  async findMany(@CurrentUser() user: User) {
    checkAbility(this.abilityFactory, user, Action.Manage, User);

    return await this.usersService.getMany();
  }
}
