import {
  Body,
  Controller,
  Inject,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto, RegisterDto } from '@repo/shared-types';
import { firstValueFrom } from 'rxjs';

import { RpcExceptionFilter } from '../../common/filters/rpc-exception.filter';
import { JwtAuthGuard } from '../../common/guards/auth.guard';

interface AuthenticatedRequest {
  token: string;
  user: { id: string; email: string };
}

@ApiTags('Authentification')
@Controller('auth')
@UseFilters(new RpcExceptionFilter())
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('register')
  @ApiOperation({
    description:
      'Crée un nouveau compte utilisateur et retourne les tokens JWT.',
    summary: 'Inscription',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    description: 'Compte créé avec succès.',
    schema: { example: { accessToken: 'eyJ...', refreshToken: 'eyJ...' } },
    status: 201,
  })
  @ApiResponse({
    description: 'Données invalides.',
    status: 400,
  })
  @ApiResponse({ description: 'Email déjà utilisé.', status: 422 })
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
  @ApiOperation({
    description: 'Authentifie un utilisateur et retourne les tokens JWT.',
    summary: 'Se connecter',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    description: 'Connexion réussie.',
    schema: { example: { accessToken: 'eyJ...', refreshToken: 'eyJ...' } },
    status: 200,
  })
  @ApiResponse({ description: 'Email ou mot de passe incorrect.', status: 401 })
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
  @ApiOperation({
    description: 'Invalide le token JWT courant.',
    summary: 'Se déconnecter',
  })
  @ApiBearerAuth()
  @ApiResponse({
    description: 'Déconnexion réussie.',
    schema: { example: { message: 'Logged out successfully' } },
    status: 200,
  })
  @ApiResponse({ description: 'Token manquant ou invalide.', status: 401 })
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
  @ApiOperation({
    description:
      "Génère un nouvel accessToken à partir d'un refreshToken valide.",
    summary: 'Rafraîchir le token',
  })
  @ApiBody({
    schema: {
      properties: {
        refreshToken: {
          description: 'Token de rafraîchissement obtenu lors de la connexion',
          example: 'eyJ...',
          type: 'string',
        },
      },
      required: ['refreshToken'],
    },
  })
  @ApiResponse({
    description: 'Token rafraîchi avec succès.',
    schema: { example: { accessToken: 'eyJ...' } },
    status: 200,
  })
  @ApiResponse({ description: 'RefreshToken invalide ou expiré.', status: 401 })
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
