import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsInt,
    IsString,
    IsUUID,
    Min,
    ValidateNested,
} from 'class-validator';

export class CartItemDto {
    @ApiProperty({ description: 'Game ID (UUID)', example: 'uuid-v4' })
    @IsString()
    @IsUUID()
    gameId!: string;

    @ApiProperty({ description: 'Quantity', example: 1, minimum: 1 })
    @IsInt()
    @Min(1)
    quantity!: number;
}

export class CreatePaymentIntentDto {
    @ApiProperty({ type: [CartItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CartItemDto)
    items!: CartItemDto[];
}
