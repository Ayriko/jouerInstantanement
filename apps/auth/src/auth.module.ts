import { Module } from '@nestjs/common';
import { AuthModule as AuthFeatureModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthFeatureModule],
})
export class AuthModule {}
