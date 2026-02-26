import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

try {
    process.loadEnvFile('../../.env');
} catch {
    // En production, les vars d'env sont injectées directement
}

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            options: {
                queue: 'users_queue',
                queueOptions: { durable: true },
                urls: [process.env.RABBITMQ_URL || ''],
            },
            transport: Transport.RMQ,
        },
    );
    await app.listen();
    console.log('Users microservice is listening on RabbitMQ (users_queue)');
}
bootstrap();
