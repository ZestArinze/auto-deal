import { EntityManager } from 'typeorm';
import { Role } from '../../auth/entities/role.entity';
import { RoleEnum } from '../../auth/enums/role.enum';
import { Seed } from '../../database/seed.entity';
import { User } from '../../users/entities/user.entity';

import { Seeder } from '../seeder.interface';
import { devEmail, password, superAdminEmail, userEmail } from './dummy/data';

export class UserSeeder implements Seeder {
  constructor(private readonly entityManager: EntityManager) {}

  async seedData(): Promise<Array<Partial<User>>> {
    const roles = await this.entityManager.find(Role);
    const userRoles = await this.entityManager.find(Role, {
      where: {
        title: RoleEnum.User,
      },
    });

    const data: Array<Partial<User>> = [];

    // dev
    data.push({
      email: devEmail,
      name: 'Arinze Zest',
      roles: roles,
      password: password,
    });

    // super admin
    data.push({
      email: superAdminEmail,
      name: 'Lweis Ankan',
      roles: userRoles,
      password: password,
    });

    // user
    data.push({
      email: userEmail,
      name: 'Lucy Woo',
      roles: userRoles,
      password: password,
    });

    for (let i = 0; i < 23; i++) {
      const email = `email${i}@example.com`;
      data.push({
        email: email,
        name: `User${i}} Lna${i}}`,
        roles: userRoles,
        password: password,
      });
    }

    return data;
  }

  async seed() {
    const id = 'user';

    if (
      !(await this.entityManager.findOne(Seed, {
        where: { id: id },
      }))
    ) {
      await this.entityManager.transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.save(User, await this.seedData());
          await transactionalEntityManager.save(new Seed(id));
        },
      );
    }
  }
}
