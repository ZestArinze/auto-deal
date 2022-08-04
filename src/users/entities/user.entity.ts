import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../auth/entities/role.entity';
import { AppBaseEntity } from '../../common/entities/app-base-entity';

@Entity()
export class User extends AppBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ select: false, nullable: true })
  password: string;

  @Column()
  name: string;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];
}
