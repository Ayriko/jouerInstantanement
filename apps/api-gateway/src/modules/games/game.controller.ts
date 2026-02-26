import {
    Controller,
    Get,
    Inject,
    Param,
    Query,
    UseFilters,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
    FilterGamesDto,
    GameFiltersValue,
    Pagination,
    PaginationDto,
} from '@repo/shared-types';
import { Game } from '@repo/prisma';
import { Observable } from 'rxjs';

import { RpcExceptionFilter } from '../../common/filters/rpc-exception.filter';

@Controller('games')
@UseFilters(new RpcExceptionFilter())
export class GameController {
    constructor(
        @Inject('GAME_SERVICE') private readonly gameClient: ClientProxy,
    ) {}

    @UseFilters(new RpcExceptionFilter())
    @Get()
    get(
        @Query() dto: PaginationDto,
        @Query() filterGamesDto: FilterGamesDto,
    ): Observable<Pagination<Game>> {
        return this.gameClient.send<Pagination<Game>>(
            { cmd: 'game.get' },
            { filterGamesDto, paginationDto: dto },
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

    @Get(':id')
    getOne(@Param('id') id: string): Observable<Game> {
        return this.gameClient.send<Game>({ cmd: 'game.getOne' }, { id });
    }
}
