import { AuthService } from './auth.service';

import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  HttpStatus,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from '../../common/src/decorator';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from '../types';
import { RtGuard } from '../../common/src/guards';
import { RtStrategiest } from '../strategies/rt.strategies';

@Controller({
  path: 'auth',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthDto) {
    return await this.authService.login(dto);
  }

  @Public()
  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: CreateUserDto): Promise<Tokens> {
    return await this.authService.register(dto);
  }
  @UseGuards(RtStrategiest)
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() userId: number) {
    return await this.authService.logout(userId);
  }

  @UseGuards(RtStrategiest)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUser('refreshToken') refreshToken: string,
    @GetCurrentUserId() userId: number,
  ) {
    return await this.authService.refreshTokens(userId, refreshToken);
  }
}
