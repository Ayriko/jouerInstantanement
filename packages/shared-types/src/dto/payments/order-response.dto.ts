export class OrderItemResponseDto {
    id!: string;
    gameId!: string;
    gameName!: string;
    quantity!: number;
    unitPrice!: number;
    assignedKey!: string | null;
}

export class OrderResponseDto {
    id!: string;
    stripePaymentId!: string;
    totalAmount!: number;
    status!: string;
    createdAt!: Date;
    items!: OrderItemResponseDto[];
}
