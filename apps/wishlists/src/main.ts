import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            options: {
                queue: 'wishlist_queue',
                queueOptions: { durable: true },
                urls: [process.env.RABBITMQ_URL || ''],
            },
            transport: Transport.RMQ,
        },
    );
    await app.listen();
    console.log(
        'Wishlists microservice is listening on RabbitMQ (wishlist_queue)',
    );
}

bootstrap();
