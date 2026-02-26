import { Injectable } from '@nestjs/common';
import { Game, GameWhereInput, PrismaService } from '@repo/prisma';
import { FilterGamesDto, Pagination, PaginationDto } from '@repo/shared-types';

@Injectable()
export class GameService {
    constructor(private readonly prismaService: PrismaService) {}

    async getGames(
        filterGamesDto: FilterGamesDto,
        paginationDto: PaginationDto,
    ): Promise<Pagination<Game>> {
        const whereParams = this.buildWhereParams(filterGamesDto);
        const count = await this.prismaService.game.count({
            where: whereParams,
        });
        const games: Game[] = await this.prismaService.game.findMany({
            where: whereParams,
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

    private buildWhereParams(filterGamesDto: FilterGamesDto): GameWhereInput {
        const whereParams: GameWhereInput = {};

        if (filterGamesDto?.name) {
            whereParams.name = {
                contains: filterGamesDto.name,
                mode: 'insensitive',
            };
        }

        if (filterGamesDto?.rating) {
            whereParams.rating = { gte: Number(filterGamesDto.rating) };
        }

        if (filterGamesDto?.genres) {
            whereParams.genres = { hasSome: filterGamesDto.genres };
        }

        if (filterGamesDto?.tags) {
            whereParams.tags = { hasSome: filterGamesDto.tags };
        }

        if (filterGamesDto?.platforms) {
            whereParams.platforms = { hasSome: filterGamesDto.platforms };
        }

        if (filterGamesDto?.price) {
            whereParams.total = { lte: Number(filterGamesDto.price) };
        }

        return whereParams;
    }
}
