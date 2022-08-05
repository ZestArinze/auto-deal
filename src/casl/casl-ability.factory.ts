import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Role } from '../auth/entities/role.entity';
import { Action } from '../auth/enums/permission.action';
import { RoleEnum } from '../auth/enums/role.enum';
import { userHasRole } from '../common/utils/auth.utils';
import { Seller } from '../sellers/entities/seller.entity';
import { User } from '../users/entities/user.entity';

type Subjects =
  | InferSubjects<typeof User>
  | typeof Role
  | typeof Seller
  | 'all';

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
      can(Action.Manage, Seller);
    } else if (userHasRole(user, RoleEnum.Editor)) {
    }

    can(Action.ManageOwn, User, { id: user.id });

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
