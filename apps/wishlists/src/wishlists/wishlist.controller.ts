import { Controller } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { MessagePattern } from '@nestjs/microservices';
import { Game } from '@repo/prisma';
import { WishlistStatus } from '@repo/shared-types';

@Controller()
export class WishlistController {
    constructor(private readonly wishlistService: WishlistService) {}

    @MessagePattern({ cmd: 'wishlist.add' })
    public async addToWishlist(data: {
        userId: string;
        gameId: string;
    }): Promise<WishlistStatus> {
        return this.wishlistService.addToWishlist(data.userId, data.gameId);
    }

    @MessagePattern({ cmd: 'wishlist.get' })
    public async get(data: { userId: string }): Promise<{ games: Game[] }> {
        return this.wishlistService.getWishlist(data.userId);
    }

    @MessagePattern({ cmd: 'wishlist.remove' })
    public async removeToWishlist(data: {
        userId: string;
        gameId: string;
    }): Promise<WishlistStatus> {
        return this.wishlistService.removeToWishlist(data.userId, data.gameId);
    }
}
