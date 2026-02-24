import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      options: {
        queue: 'game_queue',
        queueOptions: { durable: true },
        urls: [process.env.RABBITMQ_URL || ''],
      },
      transport: Transport.RMQ,
    },
  );
  await app.listen();
  console.log('Games microservice is listening on RabbitMQ (game_queue)');
}

bootstrap();
