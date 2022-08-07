import { EntityManager } from 'typeorm';
import { Brand } from '../../cars/entities/brand.entity';
import { CarBrand } from '../../cars/enums';
import { Seed } from '../seed.entity';
import { Seeder } from '../seeder.interface';

export class BrandSeeder implements Seeder {
  constructor(private readonly entityManager: EntityManager) {}

  async seed() {
    const id = 'Brand';

    if (
      !(await this.entityManager.findOne(Seed, {
        where: { id: id },
      }))
    ) {
      const data: Partial<Brand>[] = [];
      for (const value of Object.values(CarBrand)) {
        data.push({ name: value });
      }

      await this.entityManager.transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.save(Brand, data);
          await transactionalEntityManager.save(new Seed(id));
        },
      );
    }
  }
}
