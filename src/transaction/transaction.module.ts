import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Balance } from './entities/balance.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { User } from '../users/entities/user.entity';
import { RtStrategiest } from '../strategies/rt.strategies';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, Balance, Transaction])],
  providers: [TransactionService, RtStrategiest, JwtService],
  controllers: [TransactionController],
})
export class TransactionModule {}
