import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from '../auth/enums/permission.action';
import { RoleEnum } from '../auth/enums/role.enum';
import { userHasRole } from '../common/utils/auth.utils';
import { User } from '../users/entities/user.entity';

type Subjects = InferSubjects<typeof User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (userHasRole(user, RoleEnum.SuperAdmin)) {
      can(Action.Manage, 'all');
    } else if (userHasRole(user, RoleEnum.Admin)) {
      can(Action.Manage, User);
    } else if (userHasRole(user, RoleEnum.Editor)) {
    }

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
