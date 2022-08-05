import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { AppBaseEntity } from '../../common/entities/app-base-entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Seller extends AppBaseEntity {
  @Column()
  company_name: string;

  @Column({
    // unique: true
  })
  email: string;

  @Column()
  address: string;

  @ManyToMany(() => User, { onDelete: 'CASCADE' })
  @JoinTable({ name: 'user_id' })
  users: User[];
}
