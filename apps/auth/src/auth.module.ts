import { Module } from '@nestjs/common';
import { AuthModule as AuthFeatureModule } from './auth/auth.module';

@Module({
    imports: [AuthFeatureModule],
    providers: [],
})
export class AuthModule {}
