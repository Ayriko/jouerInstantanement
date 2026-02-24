import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        description: "Adresse email de l'utilisateur",
        example: 'john.doe@example.com',
        format: 'email',
    })
    @IsEmail()
    email!: string;

    @ApiProperty({
        description: 'Mot de passe (min 8 caractères)',
        example: 'SecurePass123!',
        minLength: 8,
        format: 'password',
    })
    @IsString()
    @MinLength(8)
    password!: string;
}
