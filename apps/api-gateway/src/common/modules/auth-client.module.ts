import { Module, Global } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../guards/auth.guard';

@Global()
@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'AUTH_SERVICE',
                imports: [ConfigModule],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [
                            configService.getOrThrow<string>('RABBITMQ_URL'),
                        ],
                        queue: 'auth_queue',
                        queueOptions: { durable: true },
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    providers: [JwtAuthGuard],
    exports: [ClientsModule, JwtAuthGuard],
})
export class AuthClientModule {}
