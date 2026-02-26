import {
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Post,
    Query,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
    AddGameKeysDto,
    FilterGamesDto,
    GameFiltersValue,
    GameKeyResponseDto,
    Pagination,
    PaginationDto,
} from '@repo/shared-types';
import { Game } from '@repo/prisma';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import { RpcExceptionFilter } from '../../common/filters/rpc-exception.filter';
import { JwtAuthGuard } from '../../common/guards/auth.guard.js';

@Controller('games')
@UseFilters(new RpcExceptionFilter())
export class GameController {
    constructor(
        @Inject('GAME_SERVICE') private readonly gameClient: ClientProxy,
        @Inject('KEYS_SERVICE') private readonly keysClient: ClientProxy,
    ) {}

    @Get()
    get(
        @Query() dto: PaginationDto,
        @Query() filterGamesDto: FilterGamesDto,
    ): Observable<Pagination<Game>> {
        return this.gameClient
            .send<Pagination<Game>>(
                { cmd: 'game.get' },
                { filterGamesDto, paginationDto: dto },
            )
            .pipe(
                switchMap((pagination) => {
                    const gameIds = pagination.items.map((g) => g.id);
                    return forkJoin({
                        pagination: of(pagination),
                        counts: this.keysClient.send<Record<string, number>>(
                            { cmd: 'key.getAvailableCounts' },
                            { gameIds },
                        ),
                    }).pipe(
                        map(({ pagination, counts }) => ({
                            ...pagination,
                            items: pagination.items.map((g) => ({
                                ...g,
                                availableKeyCount: counts[g.id] ?? 0,
                            })),
                        })),
                    );
                }),
            );
    }

    @Get('/filters-value')
    public getFiltersValue(): Observable<GameFiltersValue> {
        return this.gameClient.send<GameFiltersValue>(
            { cmd: 'game.getFiltersValue' },
            {},
        );
    }

    @Get('/suggestion')
    public getSuggestion(
        @Query() filterGamesDto: FilterGamesDto,
        @Query('limit') limit: number,
    ): Observable<Game[]> {
        return this.gameClient.send<Game[]>(
            { cmd: 'game.getSuggestion' },
            { filterGamesDto, limit },
        );
    }

    @Post(':id/keys')
    @UseGuards(JwtAuthGuard)
    addKeys(
        @Param('id') id: string,
        @Body() dto: AddGameKeysDto,
    ): Observable<{ added: number }> {
        return this.keysClient.send<{ added: number }>(
            { cmd: 'key.add' },
            { gameId: id, keys: dto.keys },
        );
    }

    @Get(':id/keys')
    @UseGuards(JwtAuthGuard)
    getKeys(@Param('id') id: string): Observable<GameKeyResponseDto[]> {
        return this.keysClient.send<GameKeyResponseDto[]>(
            { cmd: 'key.getAll' },
            { gameId: id },
        );
    }

    @Get(':id')
    getOne(@Param('id') id: string): Observable<Game> {
        return this.gameClient
            .send<Game>({ cmd: 'game.getOne' }, { id })
            .pipe(
                switchMap((game) =>
                    forkJoin({
                        game: of(game),
                        counts: this.keysClient.send<Record<string, number>>(
                            { cmd: 'key.getAvailableCounts' },
                            { gameIds: [game.id] },
                        ),
                    }),
                ),
                map(({ game, counts }) => ({
                    ...game,
                    availableKeyCount: counts[game.id] ?? 0,
                })),
            );
    }
}
