import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Post,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

import { RpcExceptionFilter } from '../../common/filters/rpc-exception.filter';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Game } from '@repo/prisma';
import { WishlistStatus } from '@repo/shared-types';

@Controller('wishlists')
@UseFilters(new RpcExceptionFilter())
@UseGuards(new JwtAuthGuard())
export class WishlistController {
    constructor(
        @Inject('WISHLIST_SERVICE')
        private readonly wishlistClient: ClientProxy,
    ) {}

    @Get()
    public get(
        @CurrentUser() user: { id: string; email: string },
    ): Observable<{ games: Game[] }> {
        return this.wishlistClient.send<{ games: Game[] }>(
            { cmd: 'wishlist.get' },
            { userId: user.id },
        );
    }

    @Post('add')
    public addToWishlist(
        @CurrentUser() user: { id: string; email: string },
        @Body()
        gameParam: {
            gameId: string;
        },
    ): Observable<WishlistStatus> {
        return this.wishlistClient.send<WishlistStatus>(
            { cmd: 'wishlist.add' },
            { gameId: gameParam.gameId, userId: user.id },
        );
    }

    @Delete('remove')
    public removeToWishlist(
        @CurrentUser() user: { id: string; email: string },
        @Body()
        gameParam: {
            gameId: string;
        },
    ): Observable<WishlistStatus> {
        return this.wishlistClient.send<WishlistStatus>(
            { cmd: 'wishlist.remove' },
            { gameId: gameParam.gameId, userId: user.id },
        );
    }
}
