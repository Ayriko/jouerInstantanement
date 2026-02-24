import { ConfigService } from '@nestjs/config';
import { ClientProviderOptions, Transport } from '@nestjs/microservices';

export const getRabbitMQConfig = (
    configService: ConfigService,
    queue: string,
): ClientProviderOptions => ({
    name: `${queue.toUpperCase()}_SERVICE`,
    transport: Transport.RMQ,
    options: {
        urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
        queue,
        queueOptions: {
            durable: true,
        },
        prefetchCount: 1,
    },
});
