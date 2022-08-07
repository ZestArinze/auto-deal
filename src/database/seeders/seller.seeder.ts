import { EntityManager } from 'typeorm';
import { Role } from '../../auth/entities/role.entity';
import { RoleEnum } from '../../auth/enums/role.enum';
import { Seed } from '../seed.entity';
import { Seller } from '../../sellers/entities/seller.entity';

import { Seeder } from '../seeder.interface';
import { User } from '../../users/entities/user.entity';
import { Car } from '../../cars/entities/car.entity';
import { randomItem } from '../../common/utils/number.utils';

export class SellerSeeder implements Seeder {
  constructor(private readonly entityManager: EntityManager) {}

  async seedData(): Promise<Array<Partial<Seller>>> {
    const users = await this.entityManager.find(User);
    const cars = await this.entityManager.find(Car);
    const data: Array<Partial<Seller>> = [];

    for (let i = 0; i < 33; i++) {
      data.push({
        users: [randomItem(users)],
        cars: [randomItem(cars)],
        company_name: `Company ${i}`,
        email: `company${i}@example.com`,
        address: `${1} Main street, somewhere far away`,
      });
    }

    return data;
  }

  async seed() {
    const id = 'seller';

    if (
      !(await this.entityManager.findOne(Seed, {
        where: { id: id },
      }))
    ) {
      await this.entityManager.transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.save(Seller, await this.seedData());
          await transactionalEntityManager.save(new Seed(id));
        },
      );
    }
  }
}
