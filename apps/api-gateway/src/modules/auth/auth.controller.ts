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
import { firstValueFrom } from 'rxjs';
import { RpcExceptionFilter } from '../../common/filters/rpc-exception.filter';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { LoginDto, RegisterDto } from '@repo/shared-types';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

interface AuthenticatedRequest {
  token: string;
  user: { id: string; email: string };
}

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'Inscription',
    description:
      'Crée un nouveau compte utilisateur et retourne les tokens JWT.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Compte créé avec succès.',
    schema: { example: { accessToken: 'eyJ...', refreshToken: 'eyJ...' } },
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides.',
  })
  @ApiResponse({ status: 422, description: 'Email déjà utilisé.' })
  @UseFilters(new RpcExceptionFilter())
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
    summary: 'Se connecter',
    description: 'Authentifie un utilisateur et retourne les tokens JWT.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie.',
    schema: { example: { accessToken: 'eyJ...', refreshToken: 'eyJ...' } },
  })
  @ApiResponse({ status: 401, description: 'Email ou mot de passe incorrect.' })
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
    summary: 'Se déconnecter',
    description: 'Invalide le token JWT courant.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Déconnexion réussie.',
    schema: { example: { message: 'Logged out successfully' } },
  })
  @ApiResponse({ status: 401, description: 'Token manquant ou invalide.' })
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
    summary: 'Rafraîchir le token',
    description:
      "Génère un nouvel accessToken à partir d'un refreshToken valide.",
  })
  @ApiBody({
    schema: {
      properties: {
        refreshToken: {
          type: 'string',
          example: 'eyJ...',
          description: 'Token de rafraîchissement obtenu lors de la connexion',
        },
      },
      required: ['refreshToken'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Token rafraîchi avec succès.',
    schema: { example: { accessToken: 'eyJ...' } },
  })
  @ApiResponse({ status: 401, description: 'RefreshToken invalide ou expiré.' })
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
