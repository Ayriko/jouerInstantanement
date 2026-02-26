export class GameKeyResponseDto {
    id!: string;
    gameId!: string;
    value!: string;
    isUsed!: boolean;
    usedByOrderItemId!: string | null;
    createdAt!: Date;
}
