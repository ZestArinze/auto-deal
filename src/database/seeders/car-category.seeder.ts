import { EntityManager } from 'typeorm';
import { CarCategory } from '../../cars/entities/car-category.entity';
import { Category } from '../../cars/enums';
import { Seed } from '../seed.entity';
import { Seeder } from '../seeder.interface';

export class CarCategorySeeder implements Seeder {
  constructor(private readonly entityManager: EntityManager) {}

  async seed() {
    const id = 'CarCategory';

    if (
      !(await this.entityManager.findOne(Seed, {
        where: { id: id },
      }))
    ) {
      const data: Partial<CarCategory>[] = [];

      for (const value of Object.values(Category)) {
        data.push({ name: value });
      }

      await this.entityManager.transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.save(CarCategory, data);
          await transactionalEntityManager.save(new Seed(id));
        },
      );
    }
  }
}
