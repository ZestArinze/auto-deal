import { Module } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { SellersController } from './sellers.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from './entities/seller.entity';
import { CaslModule } from '../casl/casl.module';

@Module({
  controllers: [SellersController],
  providers: [SellersService],
  imports: [UsersModule, CaslModule, TypeOrmModule.forFeature([Seller])],
})
export class SellersModule {}
