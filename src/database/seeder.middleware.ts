import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { EntityManager } from 'typeorm';
import { BrandSeeder } from './seeders/brand.seeder';
import { CarCategorySeeder } from './seeders/car-category.seeder';
import { RoleSeeder } from './seeders/role.seeder';
import { SellerSeeder } from './seeders/seller.seeder';

import { UserSeeder } from './seeders/user.seeder';

@Injectable()
export class SeederMiddleware implements NestMiddleware {
  // to avoid roundtrips to db we store the info whether
  // the seeding has been completed as boolean flag in the middleware
  // we use a promise to avoid concurrency cases. Concurrency cases may
  // occur if other requests also trigger a seeding while it has already
  // been started by the first request. The promise can be used by other
  // requests to wait for the seeding to finish.
  private isSeedingComplete: Promise<boolean>;

  constructor(
    private readonly entityManager: EntityManager,
    readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: () => void) {
    const runSeeders = +this.configService.get<number>('DB_RUN_SEEDERS', 0);

    if (!runSeeders || (await this.isSeedingComplete)) {
      return next();
    }

    this.isSeedingComplete = (async () => {
      await new RoleSeeder(this.entityManager).seed();
      await new UserSeeder(this.entityManager).seed();
      await new CarCategorySeeder(this.entityManager).seed();
      await new BrandSeeder(this.entityManager).seed();
      await new SellerSeeder(this.entityManager).seed();

      return true;
    })();

    await this.isSeedingComplete;

    next();
  }
}
