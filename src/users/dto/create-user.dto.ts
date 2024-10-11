import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsPhoneNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'O nome completo é obrigatório' })
  full_name: string;

  @IsString()
  @IsNotEmpty({ message: 'O CPF deve ser um número' })
  cpf: string;

  @IsNotEmpty()
  @IsPhoneNumber('BR')
  telefone: string;

  @IsEmail({}, { message: 'O email deve ser um endereço válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;
}
