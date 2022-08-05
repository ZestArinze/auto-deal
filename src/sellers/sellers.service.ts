import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateSellerDto } from './dto/create-seller.dto';
import { GetSellersDto } from './dto/get-sellers.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { Seller } from './entities/seller.entity';

@Injectable()
export class SellersService {
  constructor(@InjectRepository(Seller) private repo: Repository<Seller>) {}

  async create(dto: CreateSellerDto) {
    const { userIds, ...sellerData } = dto;
    const seller = this.repo.create(sellerData);
    seller.users = userIds.map((id) => ({ id } as User));

    return await this.repo.save(seller);
  }

  findMany(dto: GetSellersDto) {
    const query = this.searchQuery(dto);

    return query
      .leftJoin('seller.users', 'user')
      .select(['seller', 'user.id', 'user.email'])
      .getMany();
  }

  async findOne(id: number) {
    return this.repo
      .createQueryBuilder('seller')
      .where('seller.id = :id', { id: id })
      .leftJoin('seller.users', 'user')
      .leftJoin('user.roles', 'role')
      .select(['seller', 'user.id', 'user.email', 'user.name', 'role'])
      .getOne();
  }

  async update(id: number, dto: UpdateSellerDto) {
    const { userIds, ...sellerData } = dto;
    const seller = await this.repo.findOne({ where: { id: id } });
    Object.assign(seller, sellerData, { id: seller.id });
    seller.users = userIds.map((id) => ({ id } as User));

    return this.repo.save(seller);
  }

  async remove(id: number) {
    return await this.repo.delete({ id: id });
  }

  searchQuery(dto: Partial<GetSellersDto>) {
    const query = this.repo.createQueryBuilder('seller');

    if (dto.email) {
      query.where('seller.email = :email', { email: dto.email });
    }

    return query;
  }
}
