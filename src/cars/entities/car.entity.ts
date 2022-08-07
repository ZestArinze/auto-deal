import { Column, Entity, Generated, ManyToOne } from 'typeorm';
import { AppBaseEntity } from '../../common/entities/app-base-entity';
import { Seller } from '../../sellers/entities/seller.entity';
import { Brand } from './brand.entity';
import { CarCategory } from './car-category.entity';

@Entity()
export class Car extends AppBaseEntity {
  @Generated('uuid')
  @Column()
  vehicle_id: string;

  @Column()
  vehicle_number: string;

  @Column({ type: 'double' })
  mileage: number;

  @Column({ type: 'double' })
  price: number;

  @Column({ type: 'date' })
  year: string;

  @Column()
  name: string;

  @Column()
  engine_type: string;

  @Column()
  transmission: string;

  @Column()
  fuel_type: string;

  @Column()
  interior_color: string;

  @Column()
  exterior_color: string;

  @ManyToOne(() => Brand, (brand) => brand.cars)
  brand: Brand;

  @ManyToOne(() => CarCategory, (carCategory) => carCategory.cars)
  carCategory: CarCategory;

  @ManyToOne(() => Seller, (seller) => seller.cars)
  seller: Seller;
}
