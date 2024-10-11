import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from '../types';
import { User } from '../users/entities/user.entity';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  checkPassword(user: User, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (error, ok) => {
        return error || !ok ? resolve(false) : resolve(true);
      });
    });
  }

  async login(dto: AuthDto): Promise<Tokens> {
    const user = await this.userService.findOneByEmail(dto.email);

    if (!user) throw new ForbiddenException('User not found');

    const passwordMatches = await this.checkPassword(user, dto.password);

    if (!passwordMatches) throw new ForbiddenException('Password incorrect');

    const tokens = await this.getTokens(user.id, user.email);

    const rtHash = await this.userService.hashPassword(tokens.refresh_token);

    await this.userService.update(user.id, { hashdRt: rtHash });
    return tokens;
  }

  async logout(userId: any) {
    await this.userService.update(userId, { hashdRt: null });
  }

  async refreshTokens(userId: number, rt: string) {
    const user = await this.userService.findOne(userId);

    const tokens = await this.getTokens(user.id, user.email);

    const rtHash = await this.userService.hashPassword(tokens.refresh_token);

    await this.userService.update(user.id, { hashdRt: rtHash });
    return tokens;
  }

  async register(dto: CreateUserDto): Promise<Tokens> {
    const user = await this.userService.create(dto);

    const tokens = await this.getTokens(user.id, user.email);

    const rtHash = await this.userService.hashPassword(tokens.refresh_token);

    await this.userService.update(user.id, { hashdRt: rtHash });
    return tokens;
  }

  async getTokens(userId: number, email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '24h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '30d',
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
