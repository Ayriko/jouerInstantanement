import {
    Controller,
    Get,
    Inject,
    Param,
    Query,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Game } from '@repo/prisma';
import { Pagination, PaginationDto } from '@repo/shared-types';
import { Observable } from 'rxjs';

import { RpcExceptionFilter } from '../../common/filters/rpc-exception.filter';
import { JwtAuthGuard } from '../../common/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('games')
@UseFilters(new RpcExceptionFilter())
export class GameController {
    constructor(
        @Inject('GAME_SERVICE') private readonly gameClient: ClientProxy,
    ) {}

    @Get()
    get(@Query() dto: PaginationDto): Observable<Pagination<Game>> {
        return this.gameClient.send<Pagination<Game>>(
            { cmd: 'game.get' },
            { paginationDto: dto },
        );
    }

    @Get(':id')
    getOne(@Param('id') id: string): Observable<Game> {
        return this.gameClient.send<Game>({ cmd: 'game.getOne' }, { id });
    }
}
