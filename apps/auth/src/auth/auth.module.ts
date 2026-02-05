import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { RedisModule } from '../redis/redis.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '@repo/prisma';

@Module({
  controllers: [AuthController],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../.env'
    }),
    RedisModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: Number(config.get('JWT_EXPIRES_IN')) },
      }),
    }),
  ],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
