import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

interface ValidateResult {
  error?: string;
  user?: { id: string; email: string };
  valid: boolean;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Record<string, unknown>>();
    const authorization = request.headers as Record<string, string | undefined>;
    const token = this.extractTokenFromHeader(authorization.authorization);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const result = await firstValueFrom(
      this.authClient.send<ValidateResult>(
        { cmd: 'auth.validate' },
        { token },
      ),
    );

    if (!result.valid) {
      throw new UnauthorizedException(result.error ?? 'Invalid token');
    }

    request.user = result.user;
    request.token = token;

    return true;
  }

  private extractTokenFromHeader(
    authorization: string | undefined,
  ): string | undefined {
    const [type, token] = authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
