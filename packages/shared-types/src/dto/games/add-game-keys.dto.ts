import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class AddGameKeysDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    keys!: string[];
}
