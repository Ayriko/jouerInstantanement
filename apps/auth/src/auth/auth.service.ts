import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { auth } from './better-auth.config';

function bearerHeaders(token: string): Headers {
  return new Headers({ authorization: 'Bearer ' + token });
}

function rpcError(error: any, fallbackStatus: number, fallbackMessage: string): never {
  // better-call APIError: .statusCode (number) + .body.message (string)
  const statusCode = typeof error?.statusCode === 'number' ? error.statusCode : fallbackStatus;
  const message = error?.body?.message ?? error?.message ?? fallbackMessage;
  throw new RpcException({ statusCode, message });
}

@Injectable()
export class AuthService {
  async register(email: string, password: string) {
    try {
      const response = await auth.api.signUpEmail({
        body: {
          email,
          password,
          name: email.split('@')[0] ?? email,
        },
      });

      return { accessToken: response.token, refreshToken: response.token };
    } catch (error: any) {
      rpcError(error, 500, 'Registration failed');
    }
  }

  async login(email: string, password: string) {
    try {
      const response = await auth.api.signInEmail({
        body: { email, password },
      });

      return { accessToken: response.token, refreshToken: response.token };
    } catch (error: any) {
      rpcError(error, 401, 'Invalid credentials');
    }
  }

  async logout(token: string) {
    try {
      await auth.api.signOut({
        headers: bearerHeaders(token),
      });
    } catch {
      // Ignore sign-out errors — session may already be expired
    }

    return { message: 'Logged out successfully' };
  }

  async validateToken(token: string) {
    try {
      const session = await auth.api.getSession({
        headers: bearerHeaders(token),
      });

      if (!session) {
        return { valid: false, error: 'Invalid or expired token' };
      }

      return {
        valid: true,
        user: { email: session.user.email, id: session.user.id },
      };
    } catch {
      return { valid: false, error: 'Invalid or expired token' };
    }
  }

  async refreshToken(token: string) {
    try {
      const session = await auth.api.getSession({
        headers: bearerHeaders(token),
      });

      if (!session) {
        throw new RpcException({ statusCode: 401, message: 'Invalid or expired refresh token' });
      }

      return { accessToken: session.session.token };
    } catch (error: any) {
      if (error instanceof RpcException) throw error;
      throw new RpcException({ statusCode: 401, message: 'Invalid or expired refresh token' });
    }
  }
}
