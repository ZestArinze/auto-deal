import { Column, Entity, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../../common/entities/app-base-entity';
import { Car } from './car.entity';

@Entity()
export class CarCategory extends AppBaseEntity {
  @Column()
  name: string;

  @OneToMany(() => Car, (car) => car.brand)
  cars: Car[];
}
