import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GameController } from './game.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [GameController],
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        name: 'GAME_SERVICE',
        useFactory: (config: ConfigService) => ({
          options: {
            queue: 'game_queue',
            queueOptions: { durable: false },
            urls: [config.getOrThrow<string>('RABBITMQ_URL')],
          },
          transport: Transport.RMQ,
        }),
      },
    ]),
  ],
})
export class GameModule {}
