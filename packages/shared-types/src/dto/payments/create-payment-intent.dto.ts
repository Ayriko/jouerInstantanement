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
    @IsString()
    @IsUUID()
    gameId!: string;

    @IsInt()
    @Min(1)
    quantity!: number;
}

export class CreatePaymentIntentDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CartItemDto)
    items!: CartItemDto[];
}
