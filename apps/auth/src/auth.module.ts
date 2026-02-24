import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';

import { auth } from './auth/better-auth.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '../../.env',
            isGlobal: true,
        }),
        BetterAuthModule.forRoot({
            auth,
            disableGlobalAuthGuard: true,
        }),
    ],
})
export class AuthModule {}
