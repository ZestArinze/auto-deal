import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './entities/car.entity';

@Injectable()
export class CarsService {
  constructor(@InjectRepository(Car) private repo: Repository<Car>) {}

  async create(dto: CreateCarDto) {
    const car = this.repo.create(dto);

    return await this.repo.save(car);
  }

  findAll() {
    return `This action returns all cars`;
  }

  async findOne(id: number) {
    return this.repo
      .createQueryBuilder('car')
      .where('car.id = :id', { id: id })
      .leftJoin('car.seller', 'seller')
      .leftJoin('car.carCategory', 'carCategory')
      .leftJoin('car.brand', 'brand')
      .select(['car', 'seller', 'carCategory', 'brand'])
      .getOne();
  }

  async update(id: number, dto: UpdateCarDto) {
    const car = await this.repo.findOne({ where: { id: id } });
    Object.assign(car, dto, { id: car.id });

    return this.repo.save(car);
  }

  remove(id: number) {
    return `This action removes a #${id} car`;
  }
}
