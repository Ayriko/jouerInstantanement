import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from '../auth/auth.module';
import { WishlistController } from './wishlist.controller';

@Module({
    imports: [
        AuthModule,
        ClientsModule.registerAsync([
            {
                name: 'WISHLIST_SERVICE',
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [
                            configService.getOrThrow<string>('RABBITMQ_URL'),
                        ],
                        queue: 'wishlist_queue',
                        queueOptions: { durable: true },
                    },
                }),
            },
            {
                name: 'KEYS_SERVICE',
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [
                            configService.getOrThrow<string>('RABBITMQ_URL'),
                        ],
                        queue: 'keys_queue',
                        queueOptions: { durable: true },
                    },
                }),
            },
        ]),
    ],
    controllers: [WishlistController],
})
export class WishlistModule {}
