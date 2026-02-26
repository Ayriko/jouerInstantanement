import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '@repo/prisma';

import { KeysController } from './keys.controller';
import { KeysService } from './keys.service';

@Module({
    imports: [ConfigModule.forRoot({ envFilePath: '../../.env' })],
    controllers: [KeysController],
    providers: [KeysService, PrismaService],
})
export class KeysModule {}
