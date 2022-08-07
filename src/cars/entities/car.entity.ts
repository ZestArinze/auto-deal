import { Column, Entity, Generated, JoinColumn, ManyToOne } from 'typeorm';
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

  @Column()
  brand_id: number;
  @ManyToOne(() => Brand, (brand) => brand.cars)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Column()
  car_category_id: number;
  @ManyToOne(() => CarCategory, (carCategory) => carCategory.cars)
  @JoinColumn({ name: 'car_category_id' })
  carCategory: CarCategory;

  @Column()
  seller_id: number;
  @ManyToOne(() => Seller, (seller) => seller.cars)
  @JoinColumn({ name: 'seller_id' })
  seller: Seller;
}
