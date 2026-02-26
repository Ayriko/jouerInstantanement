import { Controller } from '@nestjs/common';
import { GameService } from './game.service';
import { MessagePattern } from '@nestjs/microservices';
import {
    FilterGamesDto,
    GameFiltersValue,
    Pagination,
    PaginationDto,
} from '@repo/shared-types';
import { Game } from '@repo/prisma';

@Controller()
export class GameController {
    constructor(private readonly gameService: GameService) {}

    @MessagePattern({ cmd: 'game.get' })
    public async get(data: {
        filterGamesDto: FilterGamesDto;
        paginationDto: PaginationDto;
    }): Promise<Pagination<Game>> {
        return this.gameService.getGames(
            data.filterGamesDto,
            data.paginationDto,
        );
    }

    @MessagePattern({ cmd: 'game.getFiltersValue' })
    public async getFiltersValue(): Promise<GameFiltersValue> {
        return this.gameService.getFiltersValue();
    }

    @MessagePattern({ cmd: 'game.getOne' })
    public async getOne(data: { id: string }): Promise<Game> {
        return this.gameService.getGame(data.id);
    }

    @MessagePattern({ cmd: 'game.getSuggestion' })
    public async getSuggestion(data: {
        filterGamesDto: FilterGamesDto;
        limit: number;
    }): Promise<Game[]> {
        return this.gameService.getGamesSuggestion(
            data.limit,
            data.filterGamesDto,
        );
    }
}
