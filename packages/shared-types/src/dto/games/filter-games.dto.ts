import {
    IsArray,
    IsBoolean,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
    MinLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export const ToArray = () =>
    Transform(({ value }) =>
        value === undefined
            ? undefined
            : Array.isArray(value)
              ? value
              : [value],
    );

export class FilterGamesDto {
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @ToArray()
    public genres?: string[];

    @IsOptional()
    @IsString()
    public name?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @ToArray()
    public platforms?: string[];

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Max(10)
    @Min(0)
    public rating?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @ToArray()
    public tags?: string[];

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    public price?: number;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    public inStock?: boolean;
}
