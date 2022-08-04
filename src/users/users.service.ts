import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistrationInput } from '../auth/dto/registration.input';
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
      .where('user.email = :email', { email });

    if (selectSecrets) {
      query.addSelect(['user.password']);
    }

    const user = await query.getOne();

    console.log({ user });

    return user;
  }

  async findById(id: number) {
    return this.repo.findOne({ where: { id: id } });
  }
}
