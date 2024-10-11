import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'balance' })
export class Balance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  balance: number;

  @OneToOne(() => User, (user) => user.balance)
  @JoinColumn()
  user: User;
}
