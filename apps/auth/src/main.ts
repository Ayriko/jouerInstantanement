import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      options: {
        urls: [process.env.RABBITMQ_URL || ''],
        queue: 'auth_queue',
        queueOptions: { durable: false },
      },
      transport: Transport.RMQ,
    },
  );
  await app.listen();
  console.log('Auth microservice is listening on RabbitMQ (auth_queue)');
}

void bootstrap();
