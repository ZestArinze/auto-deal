import { SubjectClass } from '@casl/ability';
import { ForbiddenException } from '@nestjs/common';
import { Action } from '../auth/enums/permission.action';
import { User } from '../users/entities/user.entity';
import { CaslAbilityFactory } from './casl-ability.factory';

export const checkAbility = (
  abilityFactory: CaslAbilityFactory,
  user: User,
  action: Action,
  entity: SubjectClass,
) => {
  const ability = abilityFactory.createForUser(user);
  const isAllowed = ability.can(action, entity);

  if (!isAllowed) {
    throw new ForbiddenException(
      "You don't have the right permissions to perform that action",
    );
  }
};
