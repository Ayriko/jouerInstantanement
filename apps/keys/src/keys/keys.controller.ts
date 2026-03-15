import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GameKeyResponseDto } from '@repo/shared-types';

import { KeysService } from './keys.service';

@Controller()
export class KeysController {
    constructor(private readonly keysService: KeysService) {}

    @MessagePattern({ cmd: 'key.add' })
    async addKeys(
        @Payload() data: { gameId: string; keys: string[] },
    ): Promise<{ added: number }> {
        return this.keysService.addKeys(data.gameId, data.keys);
    }

    @MessagePattern({ cmd: 'key.getAll' })
    async getKeys(
        @Payload() data: { gameId: string },
    ): Promise<GameKeyResponseDto[]> {
        return this.keysService.getKeys(data.gameId);
    }

    @MessagePattern({ cmd: 'key.getAvailableCounts' })
    async getAvailableCounts(
        @Payload() data: { gameIds: string[] },
    ): Promise<Record<string, number>> {
        return this.keysService.getAvailableCounts(data.gameIds);
    }
}
