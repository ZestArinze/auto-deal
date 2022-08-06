import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { CaslModule } from './casl/casl.module';
import { SeederModule } from './database/seeder.module';
import { UsersModule } from './users/users.module';
import { SellersModule } from './sellers/sellers.module';
import { CarsModule } from './cars/cars.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        // using sqlite for this demo
        const options: TypeOrmModuleOptions = {
          type: 'sqlite',
          database: 'test.sqlite',
          entities: [__dirname + '/../**/*.entity.js'],
          synchronize:
            process.env.NODE_ENV === 'development' &&
            parseInt(configService.get<string>('SYNC_DATABASE', '0')) === 1,
        };

        return options;
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    CaslModule,
    SeederModule,
    SellersModule,
    CarsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
