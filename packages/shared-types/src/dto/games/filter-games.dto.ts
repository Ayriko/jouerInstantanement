import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class FilterGamesDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public genres?: string[];

  @IsOptional()
  @IsString()
  public name?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public platforms?: string[];

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Max(5)
  @Min(0)
  public rating?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public tags?: string[];
}
