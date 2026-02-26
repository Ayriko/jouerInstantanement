import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '@repo/prisma';

import { UsersController } from './users.controller';
import UsersService from './users.service';

@Module({
    controllers: [UsersController],
    imports: [ConfigModule.forRoot({ envFilePath: '../../env' })],
    providers: [UsersService, PrismaService],
})
export class UsersModule {}
