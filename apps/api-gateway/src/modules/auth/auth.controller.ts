import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { LoginDto, RegisterDto } from '@repo/shared-types';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

interface AuthenticatedRequest {
  token: string;
  user: { id: string; email: string };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('register')
  @ApiOperation({ summary: "S'inscrire" })
  async register(
    @Body() dto: RegisterDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return firstValueFrom(
      this.authClient.send<{ accessToken: string; refreshToken: string }>(
        { cmd: 'auth.register' },
        dto,
      ),
    );
  }

  @Post('login')
  @ApiOperation({ summary: 'Se connecter' })
  async login(
    @Body() dto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return firstValueFrom(
      this.authClient.send<{ accessToken: string; refreshToken: string }>(
        { cmd: 'auth.login' },
        dto,
      ),
    );
  }

  @Post('logout')
  @ApiOperation({ summary: 'Se déconnecter' })
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: AuthenticatedRequest): Promise<{ message: string }> {
    return firstValueFrom(
      this.authClient.send<{ message: string }>(
        { cmd: 'auth.logout' },
        { token: req.token },
      ),
    );
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh du token' })
  async refresh(
    @Body() body: { refreshToken: string },
  ): Promise<{ accessToken: string }> {
    return firstValueFrom(
      this.authClient.send<{ accessToken: string }>(
        { cmd: 'auth.refresh' },
        body,
      ),
    );
  }
}
