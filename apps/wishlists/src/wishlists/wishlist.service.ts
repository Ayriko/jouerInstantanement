import { Injectable } from '@nestjs/common';
import { Game, PrismaService } from '@repo/prisma';
import { WishlistStatus } from '@repo/shared-types';

@Injectable()
export class WishlistService {
    constructor(private readonly prismaService: PrismaService) {}

    public async addToWishlist(
        userId: string,
        gameId: string,
    ): Promise<WishlistStatus> {
        try {
            await this.prismaService.wishlist.create({
                data: {
                    userId,
                    gameId,
                },
            });

            return { status: 'DONE' };
        } catch {
            return {
                error: 'There is an error in the deletion of the game',
                status: 'ERROR',
            };
        }
    }

    public async getWishlist(userId: string): Promise<{ games: Game[] }> {
        const wishlists = await this.prismaService.wishlist.findMany({
            where: { userId },
            include: { game: true },
        });

        return { games: wishlists.map((wishlist) => wishlist.game) };
    }

    public async removeToWishlist(
        userId: string,
        gameId: string,
    ): Promise<WishlistStatus> {
        try {
            await this.prismaService.wishlist.delete({
                where: {
                    userId_gameId: {
                        userId,
                        gameId,
                    },
                },
            });

            return { status: 'DONE' };
        } catch {
            return {
                error: 'There is an error in the deletion of the game',
                status: 'ERROR',
            };
        }
    }
}
