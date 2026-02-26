import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { PaymentsController } from './payments.controller.js';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'PAYMENT_SERVICE',
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [
                            configService.getOrThrow<string>('RABBITMQ_URL'),
                        ],
                        queue: 'payment_queue',
                        queueOptions: { durable: true },
                    },
                }),
            },
        ]),
    ],
    controllers: [PaymentsController],
})
export class PaymentsModule {}
