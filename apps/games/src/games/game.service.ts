import { Injectable } from '@nestjs/common';
import { Game, GameWhereInput, PrismaService } from '@repo/prisma';
import {
    FilterGamesDto,
    GameFiltersValue,
    Pagination,
    PaginationDto,
} from '@repo/shared-types';

@Injectable()
export class GameService {
    constructor(private readonly prismaService: PrismaService) {}

    public getFiltersValue(): Promise<GameFiltersValue> {
        return this.prismaService.$queryRawUnsafe<GameFiltersValue>(`
            SELECT array_agg(DISTINCT tag)      AS tags,
                   array_agg(DISTINCT platform) AS platforms,
                   array_agg(DISTINCT genre)    AS genres
            FROM (SELECT unnest(tags)      AS tag,
                         unnest(platforms) AS platform,
                         unnest(genres)    AS genre
                  FROM public."Game") t;`);
    }

    public async getGames(
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

    public async getGame(id: string): Promise<Game> {
        return this.prismaService.game.findUniqueOrThrow({
            where: { id },
        });
    }

    public async getGamesSuggestion(
        limit: number,
        filterGamesDto: FilterGamesDto,
    ): Promise<Game[]> {
        const whereRawParams = this.buildWhereRawParams(filterGamesDto);

        let query = 'SELECT * FROM public."Game"';

        if (whereRawParams) {
            query = `${query} ${whereRawParams}`;
        }

        console.log(query);

        return this.prismaService.$queryRawUnsafe<Game[]>(
            `${query} ORDER BY RANDOM() LIMIT ${limit}`,
        );
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

    private buildWhereRawParams(filterGamesDto: FilterGamesDto): string | null {
        const whereQuery: string[] = [];

        if (filterGamesDto?.name) {
            whereQuery.push(`name ILIKE ${filterGamesDto.name}`);
        }

        if (filterGamesDto?.rating) {
            whereQuery.push(`rating >= ${filterGamesDto.rating}`);
        }

        if (filterGamesDto?.genres) {
            whereQuery.push(`genres && ${filterGamesDto.genres}::text[]`);
        }

        if (filterGamesDto?.tags) {
            whereQuery.push(`tags && ${filterGamesDto.tags}::text[]`);
        }

        if (filterGamesDto?.platforms) {
            whereQuery.push(`platforms && ${filterGamesDto.platforms}::text[]`);
        }

        if (filterGamesDto?.price) {
            whereQuery.push(`total <= ${filterGamesDto.price}`);
        }

        if (!whereQuery.length) {
            return null;
        }

        return `WHERE ${whereQuery.join(' AND WHERE ')}`;
    }
}
