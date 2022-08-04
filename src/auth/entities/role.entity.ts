import { AppBaseEntity } from '../../common/entities/app-base-entity';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity()
export class Role extends AppBaseEntity {
  @Column()
  title: string;

  @ManyToMany(() => User, (user) => user.roles)
  users?: User[];
}
