import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'transaction' })
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({ type: 'float' })
  amount: number;

  @Column()
  date: string;

  @Column()
  type: string;

  @Column()
  pixKey: string;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;
}
