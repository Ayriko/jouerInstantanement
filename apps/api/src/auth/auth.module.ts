import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
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
})
export class AuthModule {}
