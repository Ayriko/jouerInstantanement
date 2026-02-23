import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      options: {
        urls: [process.env.RABBITMQ_URL || ''],
        queue: 'game_queue',
        queueOptions: { durable: true },
      },
      transport: Transport.RMQ,
    },
  );
  await app.listen();
  console.log('Games microservice is listening on RabbitMQ (auth_queue)');
}

bootstrap();
