import { Controller, Get, Inject, Param, Query, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Pagination, PaginationDto } from '@repo/api';
import { Game } from '@repo/prisma';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Observable } from 'rxjs';

@UseGuards(JwtAuthGuard)
@Controller('games')
export class GameController {
  constructor(
    @Inject('GAME_SERVICE') private readonly gameClient: ClientProxy,
  ) {}

  @Get()
  get(@Query() dto: PaginationDto): Observable<Pagination<Game>> {
    return this.gameClient.send<Pagination<Game>>({ cmd: 'game.get' }, { paginationDto: dto })
  }

  @Get(':id')
  getOne(@Param('id') id: string): Observable<Game> {
    return this.gameClient.send<Game>({ cmd: 'game.getOne' }, { id })
  }
}
