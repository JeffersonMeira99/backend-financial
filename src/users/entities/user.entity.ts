import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Balance } from '../../transaction/entities/balance.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  name: string;

  @Index()
  @Column({ default: null })
  full_name: string;

  @Index()
  @Column()
  email: string;

  @Column()
  cpf: string;

  @Column()
  telefone: string;

  @Column()
  password: string;

  @Column({ default: null })
  hashdRt: string | null;

  @Column({ default: true })
  isActive: boolean;

  @OneToOne(() => Balance, (balance) => balance.user)
  balance: Balance;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];
}
