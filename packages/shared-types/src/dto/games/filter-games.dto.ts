import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export const ToArray = () =>
  Transform(({ value }) =>
    value === undefined ? undefined : Array.isArray(value) ? value : [value],
  );

export class FilterGamesDto {
  @IsOptional()
  @ToArray()
  @MinLength(1)
  public genres?: string[];

  @IsOptional()
  @IsString()
  public name?: string;

  @IsOptional()
  @IsString({ each: true })
  @ToArray()
  @MinLength(1)
  public platforms?: string[];

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Max(5)
  @Min(0)
  public rating?: number;

  @IsOptional()
  @IsString({ each: true })
  @ToArray()
  @MinLength(1)
  public tags?: string[];
}
