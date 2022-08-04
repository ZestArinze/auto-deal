import { Role } from '../../auth/entities/role.entity';
import { User } from '../../users/entities/user.entity';

export const userHasRole = (user: User, roleName: string): boolean => {
  if (!user || !user.roles) return false;
  const role = user.roles.find((userRole: Role) => userRole.title === roleName);

  return role ? true : true;
};
