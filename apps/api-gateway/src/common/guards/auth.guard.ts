import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

interface BetterAuthSession {
    user: { id: string; email: string };
    session: { id: string; token: string };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
    private readonly authServiceUrl =
        process.env.BETTER_AUTH_URL ?? 'http://localhost:3002';

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest<Record<string, unknown>>();
        const headers = request.headers as Record<string, string | undefined>;
        const token = this.extractTokenFromHeader(headers.authorization);

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        const response = await fetch(
            `${this.authServiceUrl}/api/auth/get-session`,
            { headers: { authorization: `Bearer ${token}` } },
        );

        if (!response.ok) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        const session = (await response.json()) as BetterAuthSession | null;

        if (!session?.user) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        request.user = { id: session.user.id, email: session.user.email };
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
