import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsIn,
  IsPositive,
  IsPhoneNumber,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  @IsIn(['PIX', 'TED', 'Deposito'])
  type: string;

  @IsString()
  @IsNotEmpty()
  pixKey: string;
}
