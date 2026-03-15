import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { PrismaService } from '@repo/prisma';

@Module({
    controllers: [WishlistController],
    imports: [
        ConfigModule.forRoot({
            envFilePath: '../../.env',
        }),
    ],
    providers: [WishlistService, PrismaService],
})
export class WishlistModule {}
