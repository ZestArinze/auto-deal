import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SeederMiddleware } from './seeder.middleware';

@Module({})
export class SeederModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SeederMiddleware).forRoutes('*');
  }
}
