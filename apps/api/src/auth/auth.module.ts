import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './auth.guard';

@Module({
  controllers: [AuthController],
  imports: [
    ClientsModule.registerAsync([
      {
        inject: [ConfigService],
        name: 'AUTH_SERVICE',
        useFactory: (config: ConfigService) => ({
          options: {
            queue: 'auth_queue',
            queueOptions: { durable: false },
            urls: [config.getOrThrow<string>('RABBITMQ_URL')],
          },
          transport: Transport.RMQ,
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class AuthModule {}
