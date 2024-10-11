import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { User } from '../users/entities/user.entity';
import { Balance } from './entities/balance.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Balance)
    private balanceRepository: Repository<Balance>,
  ) {}

  async createTransaction(
    userId: number,
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['balance'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newTransaction =
      this.transactionRepository.create(createTransactionDto);
    newTransaction.user = user;

    const balance = user.balance;

    if (createTransactionDto.type === 'Deposito') {
      balance.balance += createTransactionDto.amount;
    } else if (
      createTransactionDto.type === 'PIX' ||
      createTransactionDto.type === 'TED'
    ) {
      if (balance.balance < createTransactionDto.amount) {
        throw new Error('Saldo insuficiente');
      }
      balance.balance -= createTransactionDto.amount;
    }

    await this.balanceRepository.save(balance);
    return this.transactionRepository.save(newTransaction);
  }

  async getBalance(userId: number): Promise<number> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['balance'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.balance.balance;
  }

  async getTransactions(userId: number): Promise<Transaction[]> {
    const transactions = await this.transactionRepository.find({
      where: { user: { id: userId } },
      order: { date: 'DESC' },
    });

    if (!transactions) {
      throw new NotFoundException('No transactions found for this user');
    }

    return transactions;
  }
}
