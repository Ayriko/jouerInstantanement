import { Controller } from '@nestjs/common';
import { GameService } from './game.service';
import { MessagePattern } from '@nestjs/microservices';
import { Pagination, PaginationDto } from '@repo/shared-types';
import { Game } from '@repo/prisma';

@Controller()
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @MessagePattern({ cmd: 'game.get' })
  async get(data: { paginationDto: PaginationDto }): Promise<Pagination<Game>> {
    return this.gameService.getGames(data.paginationDto);
  }

  @MessagePattern({ cmd: 'game.getOne' })
  async getOne(data: { id: string }): Promise<Game> {
    return this.gameService.getGame(data.id);
  }
}
