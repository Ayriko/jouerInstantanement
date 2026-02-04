import {
  Body,
  Controller,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto, RegisterDto } from '@repo/api';
import { firstValueFrom } from 'rxjs';

import { JwtAuthGuard } from './auth.guard';

interface AuthenticatedRequest {
  token: string;
  user: { id: string; email: string };
}

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<{ id: string; email: string }> {
    return firstValueFrom(
      this.authClient.send<{ id: string; email: string }>({ cmd: 'auth.register' }, dto),
    );
  }

  @Post('login')
  async login(@Body() dto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    return firstValueFrom(
      this.authClient.send<{ accessToken: string; refreshToken: string }>({ cmd: 'auth.login' }, dto),
    );
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: AuthenticatedRequest): Promise<{ message: string }> {
    return firstValueFrom(
      this.authClient.send<{ message: string }>({ cmd: 'auth.logout' }, { token: req.token }),
    );
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }): Promise<{ accessToken: string }> {
    return firstValueFrom(
      this.authClient.send<{ accessToken: string }>({ cmd: 'auth.refresh' }, body),
    );
  }
}
