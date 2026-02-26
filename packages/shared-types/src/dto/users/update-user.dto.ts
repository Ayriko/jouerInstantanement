import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @ApiPropertyOptional({ example: 'test.mail@mail.com' })
    @IsOptional()
    @IsString()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ example: 'testName' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: 'https://i.pravatar.cc/300' })
    @IsOptional()
    @IsString()
    image?: string;
}
