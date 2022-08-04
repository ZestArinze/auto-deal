import { EntityManager } from 'typeorm';
import { Role } from '../../auth/entities/role.entity';
import { RoleEnum } from '../../auth/enums/role.enum';
import { Seed } from '../../database/seed.entity';
import { Seeder } from '../seeder.interface';

export class RoleSeeder implements Seeder {
  constructor(private readonly entityManager: EntityManager) {}

  async seed() {
    const id = 'Role';

    if (
      !(await this.entityManager.findOne(Seed, {
        where: { id: id },
      }))
    ) {
      const data = [];
      for (const value of Object.values(RoleEnum)) {
        data.push({ title: value });
      }

      await this.entityManager.transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.save(Role, data);
          await transactionalEntityManager.save(new Seed(id));
        },
      );
    }
  }
}
