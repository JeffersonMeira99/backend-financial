import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { RtStrategiest } from '../strategies/rt.strategies';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(RtStrategiest)
  @Post(':userId')
  async createTransaction(
    @Param('userId') userId: number,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionService.createTransaction(
      userId,
      createTransactionDto,
    );
  }

  @Get(':userId/balance')
  async getBalance(@Param('userId') userId: number) {
    return this.transactionService.getBalance(userId);
  }

  @Get(':userId')
  async getTransactions(@Param('userId') userId: number) {
    return this.transactionService.getTransactions(userId);
  }
}
