import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

try {
    process.loadEnvFile('../../.env');
} catch {
    // .env might not exist in production — env vars come from system
}

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.RMQ,
            options: {
                urls: [
                    process.env.RABBITMQ_URL ??
                        'amqp://guest:guest@localhost:5672',
                ],
                queue: 'mail_queue',
                queueOptions: { durable: true },
                noAck: false, // acknowledge manuel = sécurité
            },
        },
    );

    await app.listen();
    console.log('Mail service listening on RabbitMQ mail_queue');
}

bootstrap();
