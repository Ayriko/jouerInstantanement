import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';

import { RedisService } from '../redis/redis.service';
import { PrismaService } from '@repo/prisma/dist/generated/prisma';
import { User } from '@repo/prisma/dist/generated/prisma';

interface JwtPayload {
  email: string;
  exp?: number;
  sub: string;
}

@Injectable()
export class AuthService {
  test: User
  private readonly refreshExpiresIn: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.refreshExpiresIn = Number(this.configService.get('JWT_REFRESH_EXPIRES_IN', '2592000'));
  }

  async register(email: string, password: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new RpcException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword },
    });

    const payload: JwtPayload = { email: user.email, sub: user.id };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new RpcException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new RpcException('Invalid credentials');
    }

    const payload: JwtPayload = { email: user.email, sub: user.id };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  async logout(token: string) {
    const decoded = this.jwtService.decode<JwtPayload>(token);

    if (decoded.exp) {
      const ttl = decoded.exp - Math.floor(Date.now() / 1000);
      if (ttl > 0) {
        await this.redisService.blacklist(token, ttl);
      }
    }

    return { message: 'Logged out successfully' };
  }

  async validateToken(token: string) {
    try {
      if (await this.redisService.isBlacklisted(token)) {
        return { error: 'Token has been revoked', valid: false };
      }

      const payload = this.jwtService.verify<JwtPayload>(token);

      return { user: { email: payload.email, id: payload.sub }, valid: true };
    } catch {
      return { error: 'Invalid or expired token', valid: false };
    }
  }

  async refreshToken(refreshToken: string) {
    if (await this.redisService.isBlacklisted(refreshToken)) {
      throw new RpcException('Token has been revoked');
    }

    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify<JwtPayload>(refreshToken);
    } catch {
      throw new RpcException('Invalid or expired refresh token');
    }

    const newAccessToken = this.jwtService.sign({
      email: payload.email,
      sub: payload.sub,
    });

    return { accessToken: newAccessToken };
  }
}
