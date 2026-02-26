import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from '@repo/prisma';
import { GameKeyResponseDto } from '@repo/shared-types';

@Injectable()
export class KeysService {
    constructor(private readonly prisma: PrismaService) {}

    async addKeys(
        gameId: string,
        keyValues: string[],
    ): Promise<{ added: number }> {
        await this.prisma.game
            .findUniqueOrThrow({ where: { id: gameId } })
            .catch(() => {
                throw new RpcException(`Game not found: ${gameId}`);
            });

        const result = await this.prisma.gameKey.createMany({
            data: keyValues.map((value) => ({ gameId, value })),
            skipDuplicates: true,
        });

        return { added: result.count };
    }

    async getKeys(gameId: string): Promise<GameKeyResponseDto[]> {
        await this.prisma.game
            .findUniqueOrThrow({ where: { id: gameId } })
            .catch(() => {
                throw new RpcException(`Game not found: ${gameId}`);
            });

        const keys = await this.prisma.gameKey.findMany({
            where: { gameId },
            orderBy: { createdAt: 'asc' },
        });

        return keys.map((k) => ({
            id: k.id,
            gameId: k.gameId,
            value: k.value,
            isUsed: k.usedByOrderItemId !== null,
            usedByOrderItemId: k.usedByOrderItemId,
            createdAt: k.createdAt,
        }));
    }

    async getAvailableCounts(
        gameIds: string[],
    ): Promise<Record<string, number>> {
        const groups = await this.prisma.gameKey.groupBy({
            by: ['gameId'],
            where: { gameId: { in: gameIds }, usedByOrderItemId: null },
            _count: { id: true },
        });

        const result: Record<string, number> = {};
        gameIds.forEach((id) => (result[id] = 0));
        groups.forEach((g) => (result[g.gameId] = g._count.id));

        return result;
    }
}
