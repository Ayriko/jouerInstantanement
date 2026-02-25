import { Injectable } from '@nestjs/common';
import { Game, PrismaService } from '@repo/prisma';
import { Pagination, PaginationDto } from '@repo/shared-types';

@Injectable()
export class GameService {
    constructor(private readonly prismaService: PrismaService) {}

    async getGames(paginationDto: PaginationDto): Promise<Pagination<Game>> {
        const count = await this.prismaService.game.count();
        const games: Game[] = await this.prismaService.game.findMany({
            take: Number(paginationDto.take),
            skip: Number(paginationDto.take) * (Number(paginationDto.page) - 1),
        });

        return {
            hasNext: Math.ceil(count / paginationDto.take) > paginationDto.page,
            hasPrevious: paginationDto.page > 1,
            items: games,
            page: paginationDto.page,
            take: paginationDto.take,
            total: count,
        };
    }

    async getGame(id: string): Promise<Game> {
        return this.prismaService.game.findUniqueOrThrow({
            where: { id },
        });
    }
}
