import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module.js';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            options: {
                queue: 'payment_queue',
                queueOptions: { durable: true },
                urls: [process.env.RABBITMQ_URL || ''],
            },
            transport: Transport.RMQ,
        },
    );
    await app.listen();
    console.log(
        'Payments microservice is listening on RabbitMQ (payment_queue)',
    );
}

bootstrap();
