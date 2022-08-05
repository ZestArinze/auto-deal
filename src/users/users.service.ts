import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistrationInput } from '../auth/dto/registration.input';
import { GetUsersDto } from './dto/get-users.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(dto: RegistrationInput, hashedPassword: string): Promise<User> {
    dto.password = hashedPassword;
    let user = this.repo.create(dto);
    user = await this.repo.save(user);
    delete user.password;

    return user;
  }

  async findOne(email: string, selectSecrets = false) {
    const query = this.repo
      .createQueryBuilder('user')
      .select('user')
      .leftJoinAndSelect('user.roles', 'role')
      .where('user.email = :email', { email });

    if (selectSecrets) {
      query.addSelect(['user.password']);
    }

    const user = await query.getOne();

    return user;
  }

  async findById(id: number) {
    return this.repo.findOne({ where: { id: id } });
  }

  async findMany(dto: GetUsersDto) {
    const query = this.searchQuery(dto);

    // TODO: paginate, search...
    const users = await query
      .select('user')
      .leftJoinAndSelect('user.roles', 'role')
      .getMany();

    return users;
  }

  searchQuery(dto: Partial<GetUsersDto>) {
    const query = this.repo.createQueryBuilder('user');

    if (dto.userIds) {
      query.where('user.id IN (:...userIds)', { userIds: dto.userIds });
    }

    return query;
  }
}
