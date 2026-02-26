import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PaymentsModule } from './payments/payments.module.js';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '../../.env',
            isGlobal: true,
        }),
        PaymentsModule,
    ],
})
export class AppModule {}
