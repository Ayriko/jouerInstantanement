import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      options: {
        queue: 'auth_queue',
        queueOptions: { durable: true },
        urls: [process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672'],
      },
      transport: Transport.RMQ,
    },
  );
  await app.listen();
  console.log('Auth microservice is listening on RabbitMQ (auth_queue)');
}

void bootstrap();
